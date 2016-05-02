import controller from './controller';

export default {
  init(io, dbConn) {
    io.of('voxel').on('connection', async (socket) => {
      let data = await controller.initClient(dbConn);
      socket.emit('init', data);

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
