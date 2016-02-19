module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on('message', function(message) {
      if (!message.text) {
        return;
      }
      if (message.text.length > 140) {
        message.text = message.text.substr(0, 140);
      }
      if (message.text.length === 0) {
        return;
      }
      io.sockets.emit('message', message);
    });
  });
};
