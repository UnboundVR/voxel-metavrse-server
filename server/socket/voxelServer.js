var controller = require('./controllers/voxelServer');

module.exports = function(io) {
  controller.init().then(function() {
    io.on('connection', function(socket) {
      socket.emit('settings', controller.getSettings());

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
