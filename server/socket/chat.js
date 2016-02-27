var controller = require('./controllers/chat');

module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on('message', function(message) {
      var broadcast = function(message) {
        io.sockets.emit('message', message);
      };
      
      controller.onMessage(message, broadcast);
    });
  });
};
