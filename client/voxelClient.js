var rle = require('../shared/rle');
var highlight = require('voxel-highlight');
var skin = require('minecraft-skin');
var player = require('voxel-player');
var engine = require('voxel-engine');

module.exports = {
  init: function(socket) {
    var self = this;
    this.lerpPercent = 0.1;
    this.others = {};
    this.connect(socket);
    return new Promise(function(resolve, reject) {
      self.onReady = resolve;
    });
  },
  connect: function(socket) {
    var self = this;
    socket.on('disconnect', function() {
      // TODO handle disconnection
    });
    this.socket = socket;
    this.bindEvents(socket);
  },
  bindEvents: function(socket) {
    var self = this;

    socket.on('connect', function() {
      self.playerID = this.id;
    });

    var processChunk = function(chunk) {
      var voxels = rle.decode(chunk.voxels);
      chunk.voxels = voxels;
      self.engine.showChunk(chunk);
    };

    socket.on('settings', function(settings) {
      settings.generateChunks = false;
      self.engine = self.createEngine(settings);
      socket.emit('created');
      socket.on('chunk', processChunk);
      socket.on('noMoreChunks', function() {
        self.engine.voxels.on('missingChunk', function(chunkPosition) {
          socket.emit('requestChunk', chunkPosition, processChunk);
        });

        self.onReady();
      });
    });

    socket.on('set', function(pos, val) {
      self.engine.setBlock(pos, val);
    });
  },
  createEngine: function(settings) {
    var self = this;
    var socket = this.socket;
    settings.controlsDisabled = false;
    self.engine = engine(settings);
    self.engine.settings = settings;

    function sendState() {
      if (!socket.connected) {
        return;
      }
      var player = self.engine.controls.target();
      var state = {
        position: player.yaw.position,
        rotation: {
          y: player.yaw.rotation.y,
          x: player.pitch.rotation.x
        }
      };
      socket.emit('state', state);
    }

    self.engine.controls.on('data', function(state) {
      var interacting = false;
      Object.keys(state).map(function(control) {
        if (state[control] > 0) {
          interacting = true;
        }
      });

      if (interacting) {
        sendState();
      }
    });

    // setTimeout is because three.js seems to throw errors if you add stuff too soon
    setTimeout(function() {
      socket.on('update', function(updates) {
        Object.keys(updates.positions).map(function(player) {
          var update = updates.positions[player];
          if (player === self.playerID) {
            return self.onServerUpdate(update); // local player
          }
          self.updatePlayerPosition(player, update); // other players
        })
      })
    }, 1000)

    socket.on('leave', function(id) {
      if (!self.others[id]) {
        return;
      }
      self.engine.scene.remove(self.others[id].mesh);
      delete self.others[id];
    });

    return self.engine;
  },
  onServerUpdate: function(update) {
    // TODO use server sent location
  },
  updatePlayerPosition: function(id, update) {
    function scale( x, fromLow, fromHigh, toLow, toHigh ) {
      return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow;
    }

    var pos = update.position;
    var player = this.others[id];
    if (!player) {
      var playerSkin = skin(this.engine.THREE, 'assets/avatars/player.png', {
        scale: new this.engine.THREE.Vector3(0.04, 0.04, 0.04)
      });
      var playerMesh = playerSkin.mesh;
      this.others[id] = playerSkin;
      playerMesh.children[0].position.y = 10;
      this.engine.scene.add(playerMesh);
    }

    var playerSkin = this.others[id];
    var playerMesh = playerSkin.mesh;
    playerMesh.position.copy(playerMesh.position.lerp(pos, this.lerpPercent));

    playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2);
    playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75);
  }
};
