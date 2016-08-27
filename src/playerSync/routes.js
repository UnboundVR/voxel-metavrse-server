import controller from './controller';
import consts from '../constants';

export default {
  init(io) {
    let broadcast = update => {
      io.of('playerSync').emit('update', update);
    };

    setInterval(() => {
      try {
        controller.sendUpdates(broadcast);
      } catch(err) {
        console.log('Error sending updates', err);
      }
    }, consts.playerSync.SEND_UPDATE_INTERVAL);

    io.of('playerSync').on('connection', socket => {
      let id = socket.id.split('#')[1];

      let broadcast = id => {
        socket.broadcast.emit('join', id);
      };

      try {
        controller.onJoin(id, broadcast);
      } catch(err) {
        console.log('Error joining user');
      }

      socket.emit('settings', controller.getSettings());

      socket.on('disconnect', () => {
        let broadcast = id => {
          socket.broadcast.emit('leave', id);
        };

        try {
          controller.onLeave(id, broadcast);
        } catch(err) {
          console.log('Error with user leaving', err);
        }
      });

      socket.on('state', state => {
        try {
          controller.onState(id, state);
        } catch(err) {
          console.log('Error updating state', err);
        }
      });
    });
  }
};
