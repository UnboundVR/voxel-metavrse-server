import consts from '../constants';
import controller from './controller';

export default function(io) {
  controller.init().then(() => {
    setInterval(() => {
      controller.saveChunks().catch(err => {
        console.log('Error auto saving chunks', err);
      });
    }, consts.voxel.AUTO_SAVE_INTERVAL);

    io.of('voxel').on('connection', socket => {
      socket.emit('init', controller.initClient());

      socket.on('requestChunk', (chunkPosition, callback) => {
        controller.requestChunk(chunkPosition).then(chunk => {
          callback(null, chunk);
        }).catch(err => {
          callback(err);
          console.log('Error getting chunk', err);
        });
      });

      socket.on('set', (pos, val) => {
        let broadcast = (pos, val) => {
          socket.broadcast.emit('set', pos, val);
        };

        controller.set(pos, val, broadcast);
      });
    });
  }).catch(err => {
    console.log('Error initializing voxel module', err);
  });
}
