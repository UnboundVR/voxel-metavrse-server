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

  var clients = {};
  var chunkCache = {};

  loadInitialChunks().then(init); // at this point we have the first chunks generated but we overwrite them with whatever is on the storage (TODO only generate a chunk if it's not in storage)

  function loadInitialChunks() {
    var promises = [];
    Object.keys(game.voxels.chunks).forEach(function(chunkId) {
      promises.push(loadChunkFromStorage(chunkId));
    });

    return Promise.all(promises);
  }

  function sendUpdate() {
    var clientKeys = Object.keys(clients);
    if (clientKeys.length === 0) {
      return;
    }
    var update = {
      positions:{},
      date: new Date()
    };

    clientKeys.forEach(function(key) {
      var player = clients[key]
      update.positions[key] = {
        position: player.position,
        rotation: {
          x: player.rotation.x,
          y: player.rotation.y
        }
      }
    });
    io.sockets.emit('update', update);
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
    setInterval(sendUpdate, 1000/22); // 45ms

    io.on('connection', function(socket) {
      var id = socket.id;

      var player = {
        rotation: new game.THREE.Vector3(),
        position: new game.THREE.Vector3()
      };

      clients[id] = player;

      socket.emit('id', id);
      socket.broadcast.emit('join', id);

      socket.on('disconnect', function() {
        delete clients[id];
        socket.broadcast.emit('leave', id);
      });

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
        // fires when client sends us new input state
        socket.on('state', function(state) {
          player.rotation.x = state.rotation.x;
          player.rotation.y = state.rotation.y;
          var pos = player.position;
          var distance = pos.distanceTo(state.position);
          if (distance > 20) {
            var before = pos.clone();
            pos.lerp(state.position, 0.1);
            return;
          }
          pos.copy(state.position);
        });
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
