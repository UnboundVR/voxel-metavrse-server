import controller from './controller';

export default {
  init(io, dbConn) {
    io.of('voxel').on('connection', async (socket) => {
      try {
        let data = await controller.initClient(dbConn);
        socket.emit('init', data);
      } catch(err) {
        console.log('Error initializing client', err);
      }

      socket.on('requestChunk', (chunkPosition, callback) => {
        try {
          callback(null, controller.requestChunk(chunkPosition));
        } catch(err) {
          console.log(`Error requesting chunk at ${chunkPosition}`, err);
        }
      });

      socket.on('set', async (token, pos, val) => {
        let broadcast = (pos, val) => {
          socket.broadcast.emit('set', pos, val);
        };

        try {
          await controller.set(token, pos, val, broadcast);
        } catch(err) {
          console.log(`Error setting block of type ${val} at ${pos}`, err);
        }
      });
    });
  }
};
