var controller = require('./controllers/playerSync');

module.exports = function(io) {
  var broadcast = function(update) {
    io.sockets.emit('update', update);
  };
  controller.init(broadcast);

  io.on('connection', function(socket) {
    var id = socket.id;

    var sendId = function(id) {
      socket.emit('id', id);
    };

    var broadcast = function(id) {
      socket.broadcast.emit('join', id);
    };

    controller.onJoin(id, sendId, broadcast);

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
