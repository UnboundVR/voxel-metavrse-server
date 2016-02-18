var engine = require('voxel-engine');
var texturePath = 'assets/textures/';
var voxel = require('voxel');
var rle = require('../shared/rle');
var blocks = require('../shared/blocks');
var storage = require('./storage');
var Promise = require('promise');

module.exports = function(io) {
  var settings = {
    generate: function(x, y, z) {
      return y === 1 ? 1 : 0
    },
    chunkDistance: 2,
    materials: blocks.getMaterials(),
    texturePath: texturePath,
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    avatarInitialPosition: [0, 2, 0]
  };

  var game = engine(settings);
  var chunkCache = {};

  loadInitialChunks().then(init); // at this point we have the first chunks generated but we overwrite them with whatever is on the storage (TODO only generate a chunk if it's not in storage)

  function loadInitialChunks() {
    var promises = [];
    Object.keys(game.voxels.chunks).forEach(function(chunkId) {
      promises.push(loadChunkFromStorage(chunkId));
    });

    return Promise.all(promises);
  }

  function saveChunks() {
    Object.keys(game.voxels.chunks).forEach(function(chunkId) {
      var chunk = getChunk(chunkId);
      if(chunk.dirty) {
        game.voxels.chunks[chunkId].dirty = false;
        storage.saveChunk(chunk);
      }
    });
  }

  function invalidateChunkCache(chunkId) {
    if (chunkCache[chunkId]) {
      delete chunkCache[chunkId];
    }
  }

  function updateChunkCache(chunkId) {
    var encoded = chunkCache[chunkId];
    if (!encoded) {
      var chunk = game.voxels.chunks[chunkId];
      chunk.dirty = true;
      encoded = rle.encode(chunk.voxels);
      chunkCache[chunkId] = encoded;
    }

    return encoded;
  }

  function chunkExists(chunkId) {
    return !!game.voxels.chunks[chunkId];
  }

  function getChunk(chunkId) {
    var chunk = game.voxels.chunks[chunkId];
    var encoded = updateChunkCache(chunkId);

    return {
      position: chunk.position,
      dims: chunk.dims,
      dirty: chunk.dirty,
      voxels: encoded,
      chunkId: chunkId
    };
  }

  function loadChunkFromStorage(chunkId) {
    return storage.loadChunk(chunkId).then(function(chunk) {
      if(chunk) {
        chunk.voxels = rle.decode(chunk.voxels);
        game.voxels.chunks[chunkId] = chunk;
        return chunk;
      }
    });
  }

  function generateChunk(chunkId) {
    game.pendingChunks.push(chunkId);
    game.loadPendingChunks(game.pendingChunks.length);
  }

  function ensureChunkExists(chunkId) {
    if(!chunkExists(chunkId)) {
      return loadChunkFromStorage(chunkId).then(function(chunk) {
        if(!chunk) {
          generateChunk(chunkId);
        }
      });
    } else {
      return new Promise(function(resolve) {
        resolve();
      });
    }
  }

  function init() {
    setInterval(saveChunks, 1000); // 1s

    io.on('connection', function(socket) {
      socket.emit('settings', settings);

      socket.on('requestChunk', function(chunkPosition, callback) {
        var chunkId = chunkPosition.join('|');

        ensureChunkExists(chunkId).then(function() {
          callback(getChunk(chunkId));
        });
      });

      function sendInitialChunks(socket) {
        Object.keys(game.voxels.chunks).forEach(function(chunkId) {
          socket.emit('chunk', getChunk(chunkId));
        });
        socket.emit('noMoreChunks');
      }

      // fires when the user tells us they are
      // ready for chunks to be sent
      socket.on('created', function() {
        sendInitialChunks(socket);
      });

      socket.on('set', function(pos, val) {
        game.setBlock(pos, val);
        var chunkPos = game.voxels.chunkAtPosition(pos);
        var chunkId = chunkPos.join('|');
        invalidateChunkCache(chunkId);
        socket.broadcast.emit('set', pos, val);
      });
    });
  }
};
