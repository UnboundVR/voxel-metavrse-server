var storage = require('../../services/store/voxels');
var Promise = require('promise');

var engine = require('../../services/voxelEngine');
var compression = require('../../helpers/chunkCompression');

var dirtyChunks = {};

function isDirty(chunkId) {
  return !!dirtyChunks[chunkId];
}

function markDirty(chunkId) {
  dirtyChunks[chunkId] = true;
}

function markNotDirty(chunkId) {
  dirtyChunks[chunkId] = false;
}

function loadChunkFromStorage(chunkId) {
  return storage.loadChunk(chunkId).then(function(chunk) {
    if(chunk) {
      chunk = compression.decompress(chunk);
      engine.setChunk(chunkId, chunk);
      return chunk;
    }
  });
}

function loadInitialChunksFromStorage() {
  var promises = [];
  engine.getExistingChunkIds().forEach(function(chunkId) {
    promises.push(loadChunkFromStorage(chunkId));
  });
  return Promise.all(promises);
}

function saveChunks() {
  engine.getExistingChunkIds().forEach(function(chunkId) {
    var chunk = getChunk(chunkId); // this is necessary to ensure all newly compressed chunks are marked dirty
    if(isDirty(chunkId)) {
      console.log(chunkId + ' dirty')
      storage.saveChunk(chunkId, chunk).then(function() {
        markNotDirty(chunkId);
      });
    }
  });
}

function getChunk(chunkId) {
  var chunk = engine.getChunk(chunkId);
  return compression.compress(chunk, markDirty);
}

function ensureChunkExists(chunkId) {
  if(engine.chunkExists(chunkId)) {
    return Promise.resolve();
  } else {
    return loadChunkFromStorage(chunkId).then(function(chunk) {
      if(!chunk) {
        engine.generateChunk(chunkId);
      }
    });
  }
}

module.exports = {
  init: function() {
    engine.init();
    return loadInitialChunksFromStorage().then(function() {
      setInterval(saveChunks, 1000); // 1s
      // at this point we have the first chunks generated but we overwrite them with whatever is on the storage (TODO only generate a chunk if it's not in storage)
    });
  },
  getSettings: engine.getSettings,
  requestChunk: function(chunkPos, callback) {
    var chunkId = engine.getChunkId(chunkPos);
    ensureChunkExists(chunkId).then(function() {
      callback(getChunk(chunkId));
    });
  },
  sendInitialChunks: function(sendChunk, noMoreChunks) {
    engine.getExistingChunkIds().forEach(function(chunkId) {
      sendChunk(getChunk(chunkId));
    });
    noMoreChunks();
  },
  set: function(pos, val, broadcast) {
    engine.setBlock(pos, val);
    var chunkId = engine.getChunkIdAtPosition(pos);
    compression.invalidateCache(chunkId);
    broadcast(pos, val);
  }
};
