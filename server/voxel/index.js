var consts = require('../../shared/constants');
var controller = require('./controller');

module.exports = function(io) {
  controller.init().then(function() {
    setInterval(function() {
      controller.saveChunks().catch(function(err) {
        console.log('Error auto saving chunks', err);
      });
    }, consts.voxel.AUTO_SAVE_INTERVAL);

    io.on('connection', function(socket) {
      socket.emit('init', controller.initClient());

      socket.on('requestChunk', function(chunkPosition, callback) {
        controller.requestChunk(chunkPosition).then(function(chunk) {
          callback(chunk);
        }).catch(function(err) {
          console.log('Error getting chunk', err);
        });
      });

      socket.on('set', function(pos, val) {
        var broadcast = function(pos, val) {
          socket.broadcast.emit('set', pos, val);
        }

        controller.set(pos, val, broadcast);
      });
    });
  }).catch(function(err) {
    console.log('Error initializing voxel module', err);
  });
};
