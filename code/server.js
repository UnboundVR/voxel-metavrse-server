var crunch = require('voxel-crunch');
var engine = require('voxel-engine');
var texturePath = require('painterly-textures')(__dirname);
var voxel = require('voxel');

module.exports = function(io) {
  /*var settings = {
    generate: function(x, y, z) {
      return y === 1 ? 1 : 0
    },
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    texturePath: texturePath, //this is already in the client, do we need it?
    materials: [['grass', 'dirt', 'grass_dirt'], 'obsidian'],
    avatarInitialPosition: [2, 2, 2]
  };*/

  var settings = {
    generate: function(x, y, z) {
      return y === 1 ? 1 : 0
    },
    chunkDistance: 2,
    materials: [
    ['grass', 'dirt', 'grass_dirt'],
    'obsidian',
    'brick',
    'grass'
    ],
    texturePath: texturePath,
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    avatarInitialPosition: [2, 20, 2]
  };

  var game = engine(settings);

  var clients = {};
  var chunkCache = {};

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

  setInterval(sendUpdate, 1000/22); // 45ms

  io.on('connection', function(socket) {
    console.log('user connected')
    var id = socket.id;

    var player = {
      rotation: new game.THREE.Vector3(),
      position: new game.THREE.Vector3()
    };

    clients[id] = player;

    console.log(id, 'joined')
    socket.emit('id', id);
    socket.broadcast.emit('join', id);

    socket.on('disconnect', function() {
      delete clients[id];
      console.log(id, 'left');
      socket.broadcast.emit('leave', id);
    });

    // give the user the initial game settings
    if (settings.generate != null) {
      settings.generatorToString = settings.generate.toString()
    }
    socket.emit('settings', settings);

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
      var chunkID = chunkPos.join('|');
      if (chunkCache[chunkID]) {
        delete chunkCache[chunkID];
      }
      socket.broadcast.emit('set', pos, val);
    });

  });

  function sendInitialChunks(socket) {
    console.log(Object.keys(game.voxels.chunks).length + ' chunks')
    Object.keys(game.voxels.chunks).forEach(function(chunkID) {
      // TODO use crunch again!
      var chunk = game.voxels.chunks[chunkID];
      socket.emit('chunk', chunk);
    });
    socket.emit('noMoreChunks');
  }
};
