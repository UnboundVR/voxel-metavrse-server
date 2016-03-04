var controller = require('./controllers/coding');

module.exports = function(io) {
  controller.init().then(function() {
    io.on('connection', function(socket) {
      socket.on('requestAllCode', function(token, callback) {
        controller.getAllCode(token).then(callback);
      });

      socket.on('codeChanged', function(position, code, token, callback) {
        var broadcast = function(position, codeObj) {
          socket.broadcast.emit('codeChanged', position, codeObj);
        };

        controller.onCodeChanged(position, code, token, broadcast).then(function(codeObj) {
          callback(null, codeObj);
        }, function(err) {
          callback(err);
        });
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
