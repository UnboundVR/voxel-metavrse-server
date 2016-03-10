var THREE = require('three');
var consts = require('../../shared/constants');

var clients = {};

module.exports = {
  sendUpdates: function(broadcast) {
    var clientKeys = Object.keys(clients);
    if (clientKeys.length === 0) {
      return;
    }
    var update = {
      positions: {},
      date: new Date()
    };
    clientKeys.forEach(function(key) {
      var player = clients[key];
      update.positions[key] = {
        position: player.position,
        rotation: {
          x: player.rotation.x,
          y: player.rotation.y
        }
      }
    });

    broadcast(update);
  },
  onJoin: function(id, broadcast) {
    var player = {
      rotation: new THREE.Vector3(),
      position: new THREE.Vector3()
    };
    var initialPosition = consts.playerSync.AVATAR_INITIAL_POSITION;
    player.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);

    clients[id] = player;

    broadcast(id);
  },
  onLeave: function(id, broadcast) {
    delete clients[id];
    broadcast(id);
  },
  onState: function(id, state) {
    var player = clients[id];
    player.rotation.x = state.rotation.x;
    player.rotation.y = state.rotation.y;
    var pos = player.position;
    var distance = pos.distanceTo(state.position);
    if (distance > consts.playerSync.ROUGH_MOVEMENT_THRESHOLD) {
      var before = pos.clone();
      pos.lerp(state.position, consts.playerSync.LERP_PERCENT);
      return;
    }
    pos.copy(state.position);
  }
};
