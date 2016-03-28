var consts = require('../constants');
var controller = require('./controller');

module.exports = function(io) {
  controller.init();
    // setInterval(function() {
    //   controller.saveChunks().catch(function(err) {
    //     console.log('Error auto saving chunks', err);
    //   });
    // }, consts.voxel.AUTO_SAVE_INTERVAL);

  io.of('voxel').on('connection', function(socket) {
    socket.emit('init', controller.initClient());

    socket.on('requestChunk', function(chunkPosition, callback) {
      callback(null, controller.requestChunk(chunkPosition));
    });

    socket.on('set', function(pos, val) {
      var broadcast = function(pos, val) {
        socket.broadcast.emit('set', pos, val);
      };

      controller.set(pos, val, broadcast);
    });
  });
};
