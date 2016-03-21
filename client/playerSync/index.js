var setupAvatar = require('./avatar');
var voxelEngine = require('../voxelEngine');
var consts = require('../../shared/constants');
var skin = require('minecraft-skin');
var io = require('socket.io-client');

var socket;

module.exports = {
  init: function() {
    var self = this;
    socket = io.connect(location.host + '/playerSync');
    socket.on('connect', function() {
      self.playerId = socket.id;
    });
    this.others = {};

    function sendState() {
      if (!socket.connected) {
        return;
      }
      var player = voxelEngine.engine.controls.target();
      var state = {
        position: player.yaw.position,
        rotation: {
          y: player.yaw.rotation.y,
          x: player.pitch.rotation.x
        }
      };
      socket.emit('state', state);
    }

    voxelEngine.engine.controls.on('data', function(state) {
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
          if (player === self.playerId) {
            return self.onServerUpdate(update); // local player
          }
          self.updatePlayerPosition(player, update); // other players
        });
      });
    }, 1000);

    socket.on('leave', function(id) {
      if (!self.others[id]) {
        return;
      }
      voxelEngine.engine.scene.remove(self.others[id].mesh);
      delete self.others[id];
    });

    setupAvatar();
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
      let playerSkin = skin(voxelEngine.engine.THREE, 'assets/avatars/player.png', {
        scale: new voxelEngine.engine.THREE.Vector3(0.04, 0.04, 0.04)
      });
      let playerMesh = playerSkin.mesh;
      this.others[id] = playerSkin;
      playerMesh.children[0].position.y = 10;
      voxelEngine.engine.scene.add(playerMesh);
    }

    let playerSkin = this.others[id];
    let playerMesh = playerSkin.mesh;
    playerMesh.position.copy(playerMesh.position.lerp(pos, consts.playerSync.LERP_PERCENT));

    playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2);
    playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75);
  }
};
