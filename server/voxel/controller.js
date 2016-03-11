var Promise = require('promise');
var storage = require('./store');
var engine = require('./voxelEngine');
var compression = require('./chunkCompression');

function loadChunkFromStorage(chunkId) {
  return storage.loadChunk(chunkId.split('|').map(function(pos) {
    return parseInt(pos);
  })).then(function(chunk) {
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

function getChunk(chunkId) {
  var chunk = engine.getChunk(chunkId);
  return compression.compress(chunk);
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
    var chunk = getChunk(chunkId);
    broadcast(pos, val);
    return storage.saveChunk(chunk);
  }
};
