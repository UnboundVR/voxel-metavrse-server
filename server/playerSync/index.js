var controller = require('./controller');

module.exports = function(io) {
  var broadcast = function(update) {
    io.sockets.emit('update', update);
  };
  controller.init(broadcast);

  io.on('connection', function(socket) {
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
