import controller from './controller';
import consts from '../constants';

export default {
  init(io) {
    let broadcast = update => {
      io.of('playerSync').emit('update', update);
    };

    setInterval(() => {
      controller.sendUpdates(broadcast);
    }, consts.playerSync.SEND_UPDATE_INTERVAL);

    io.of('playerSync').on('connection', socket => {
      let id = socket.id.split('#')[1];

      let broadcast = id => {
        socket.broadcast.emit('join', id);
      };

      controller.onJoin(id, broadcast);

      socket.emit('settings', controller.getSettings());

      socket.on('disconnect', () => {
        let broadcast = id => {
          socket.broadcast.emit('leave', id);
        };

        controller.onLeave(id, broadcast);
      });

      socket.on('state', state => {
        controller.onState(id, state);
      });
    });
  }
}
