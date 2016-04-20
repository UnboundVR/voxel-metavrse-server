import controller from './controller';

export default {
  init(io) {
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
};
