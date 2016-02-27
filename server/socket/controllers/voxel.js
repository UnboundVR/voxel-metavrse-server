var storage = require('../../services/storage');
var Promise = require('promise');

var service = require('../../services/voxel');
var compression = require('../../services/chunkCompression');

var settings;

var dirtyChunks = {};

function isDirty(chunkId) {
  return !!dirtyChunks[chunkId];
}

function markDirty(chunkId) {
  dirtyChunks[chunkId] = true;
}

function markNotDirty(chunkId) {
  dirtyChunks[chunkId] = true;
}

function loadChunkFromStorage(chunkId) {
  return storage.loadChunk(chunkId).then(function(chunk) {
    if(chunk) {
      chunk = compression.decompress(chunk);
      service.setChunk(chunkId, chunk);
      return chunk;
    }
  });
}

function loadInitialChunksFromStorage() {
  var promises = [];
  service.getExistingChunkIds().forEach(function(chunkId) {
    promises.push(loadChunkFromStorage(chunkId));
  });

  return Promise.all(promises);
}

function saveChunks() {
  service.getExistingChunkIds().forEach(function(chunkId) {
    var chunk = getChunk(chunkId); // this is necessary to ensure all newly compressed chunks are marked dirty
    if(isDirty(chunkId)) {
      storage.saveChunk(chunkId, chunk).then(function() {
        markNotDirty(chunkId);
      });
    }
  });
}

function getChunk(chunkId) {
  var chunk = service.getChunk(chunkId);
  return compression.compress(chunk, markDirty);
}

function ensureChunkExists(chunkId) {
  if(service.chunkExists(chunkId)) {
    return Promise.resolve();
  } else {
    return loadChunkFromStorage(chunkId).then(function(chunk) {
      if(!chunk) {
        service.generateChunk(chunkId);
      }
    });
  }
}

module.exports = {
  init: function() {
    service.init();

    return loadInitialChunksFromStorage().then(function() {
      setInterval(saveChunks, 1000); // 1s
      // at this point we have the first chunks generated but we overwrite them with whatever is on the storage (TODO only generate a chunk if it's not in storage)
    });
  },
  onJoin: function(sendSettings) {
    sendSettings(service.getSettings());
  },
  requestChunk: function(chunkPos, callback) {
    var chunkId = service.getChunkId(chunkPos);

    ensureChunkExists(chunkId).then(function() {
      callback(getChunk(chunkId));
    });
  },
  sendInitialChunks: function(sendChunk, noMoreChunks) {
    service.getExistingChunkIds().forEach(function(chunkId) {
      sendChunk(getChunk(chunkId));
    });
    noMoreChunks();
  },
  set: function(pos, val, broadcast) {
    service.setBlock(pos, val);
    var chunkId = service.getChunkIdAtPosition(pos);
    compression.invalidateCache(chunkId);
    broadcast(pos, val);
  }
};
