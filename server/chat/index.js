var controller = require('./controller');

module.exports = function(io) {
  io.of('chat').on('connection', function(socket) {
    socket.on('message', function(message) {
      var broadcast = function(message) {
        socket.broadcast.emit('message', message);
      };

      controller.onMessage(message, broadcast);
    });
  });
};
