import controller from './controller';

export default function(io, dbConn) {
  return controller.init(dbConn).then(() => {
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
  });

  // setInterval(function() {
  //   controller.saveChunks().catch(function(err) {
  //     console.log('Error auto saving chunks', err);
  //   });
  // }, consts.voxel.AUTO_SAVE_INTERVAL);
}
