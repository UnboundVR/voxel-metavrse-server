var THREE = require('three');

var clients = {};

module.exports = function(io) {
  setInterval(sendUpdate, 1000/22); // 45ms

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

  io.on('connection', function(socket) {
    var id = socket.id;

    var player = {
      rotation: new THREE.Vector3(),
      position: new THREE.Vector3()
    };

    clients[id] = player;

    socket.emit('id', id);
    socket.broadcast.emit('join', id);

    socket.on('disconnect', function() {
      delete clients[id];
      socket.broadcast.emit('leave', id);
    });

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
};
