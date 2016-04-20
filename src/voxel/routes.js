import controller from './controller';
import events from '../events';
import constants from '../constants';

export default {
  init(io) {
    io.of('voxel').on('connection', socket => {
      socket.emit('initializing');
      console.log('server initialized');
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

      //FIXME
      //Event to handle a client sending requests when the server is still
      //not initialized
      events.on(constants.SERVER_INITIALIZED, data => {
      });
    });
  }
};
