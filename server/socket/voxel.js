var controller = require('./controllers/voxel');

module.exports = function(io) {
  controller.init().then(function() {
    io.on('connection', function(socket) {
      var sendSettings = function(settings) {
        socket.emit('settings', settings);
      };

      controller.onJoin(sendSettings);

      socket.on('created', function() {
        var sendChunk = function(chunk) {
          socket.emit('chunk', chunk);
        };

        var noMoreChunks = function() {
          socket.emit('noMoreChunks');
        };

        controller.sendInitialChunks(sendChunk, noMoreChunks);
      });

      socket.on('requestChunk', function(chunkPosition, callback) {
        controller.requestChunk(chunkPosition, callback);
      });

      socket.on('set', function(pos, val) {
        var broadcast = function(pos, val) {
          socket.broadcast.emit('set', pos, val);
        }

        controller.set(pos, val, broadcast);
      });
    });
  });
};
