var controller = require('./controllers/coding');

module.exports = function(io) {
  controller.init().then(function() {
    io.on('connection', function(socket) {
      socket.on('requestGists', function(callback) {
        callback(controller.getGists());
      });

      socket.on('codeChanged', function(position, gistId) {
        var broadcast = function(position, gistId) {
          socket.broadcast.emit('codeChanged', position, gistId);
        };

        controller.onCodeChanged(position, gistId, broadcast);
      });

      socket.on('codeRemoved', function(position) {
        var broadcast = function(position) {
          socket.broadcast.emit('codeRemoved', position);
        };

        controller.onCodeRemoved(position, broadcast);
      });
    });
  });
};
