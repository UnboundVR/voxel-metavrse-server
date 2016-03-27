var Promise = require('promise');
var storage = require('./store');
var engine = require('./voxelEngine');
var compression = require('./chunkCompression');

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
  return storage.loadChunk(chunkId.replace(/\|/g, '_')).then(function(chunk) {
    if(chunk) {
      compression.storeInCache(chunk);
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
    return loadInitialChunksFromStorage();
  },
  saveChunks: function() {
    return Promise.all(engine.getExistingChunkIds().map(function(chunkId) {
      var chunk = getChunk(chunkId); // this is necessary to ensure all newly compressed chunks are marked dirty
      if(isDirty(chunkId)) {
        return storage.saveChunk(chunkId.replace(/\|/g, '_'), chunk).then(function() {
          markNotDirty(chunkId);
        });
      } else {
        return Promise.resolve();
      }
    }));
  },
  initClient: function() {
    return {
      settings: engine.getSettings(),
      chunks: engine.getExistingChunkIds().map(getChunk)
    };
  },
  requestChunk: function(chunkPos) {
    var chunkId = engine.getChunkId(chunkPos);
    return ensureChunkExists(chunkId).then(function() {
      return getChunk(chunkId);
    });
  },
  set: function(pos, val, broadcast) {
    engine.setBlock(pos, val);
    var chunkId = engine.getChunkIdAtPosition(pos);
    compression.invalidateCache(chunkId);
    broadcast(pos, val);
  }
};
