var THREE = require('three');
var consts = require('../../shared/constants');

var clients = {};

module.exports = {
  init: function(broadcast) {
    var sendUpdate = function() {
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

      broadcast(update);
    };

    setInterval(sendUpdate, consts.playerSync.SEND_UPDATE_INTERVAL);
  },
  onJoin: function(id, broadcast) {
    var player = {
      rotation: new THREE.Vector3(),
      position: new THREE.Vector3()
    };

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
    if (distance > 20) {
      var before = pos.clone();
      pos.lerp(state.position, 0.1);
      return;
    }
    pos.copy(state.position);
  }
};
