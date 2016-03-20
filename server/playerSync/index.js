var controller = require('./controller');
var consts = require('../../shared/constants');

module.exports = function(io) {
  var broadcast = function(update) {
    io.of('playerSync').emit('update', update);
  };

  setInterval(function() {
    controller.sendUpdates(broadcast);
  }, consts.playerSync.SEND_UPDATE_INTERVAL);

  io.of('playerSync').on('connection', function(socket) {
    var id = socket.id.split('#')[1];

    var broadcast = function(id) {
      socket.broadcast.emit('join', id);
    };

    controller.onJoin(id, broadcast);

    socket.on('disconnect', function() {
      var broadcast = function(id) {
        socket.broadcast.emit('leave', id);
      };

      controller.onLeave(id, broadcast);
    });

    socket.on('state', function(state) {
      controller.onState(id, state);
    });
  });
};
