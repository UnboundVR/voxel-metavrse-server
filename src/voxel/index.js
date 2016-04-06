// import consts from '../constants';
import controller from './controller';

export default function(io) {
  controller.init();
    // setInterval(function() {
    //   controller.saveChunks().catch(function(err) {
    //     console.log('Error auto saving chunks', err);
    //   });
    // }, consts.voxel.AUTO_SAVE_INTERVAL);

  io.of('voxel').on('connection', socket => {
    socket.emit('init', controller.initClient());

    socket.on('requestChunk', (chunkPosition, callback) => {
      callback(null, controller.requestChunk(chunkPosition));
    });

    socket.on('set', (pos, val) => {
      let broadcast = (pos, val) => {
        socket.broadcast.emit('set', pos, val);
      };

      controller.set(pos, val, broadcast);
    });
  });
}
