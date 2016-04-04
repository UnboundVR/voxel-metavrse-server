import controller from './controller';
import consts from '../constants';

export default function(io) {
  controller.init().then(() => {
    setInterval(() => {
      controller.storeCode().catch(err => {
        console.log('Error updating code', err);
      });
    }, consts.coding.AUTO_SAVE_INTERVAL);

    io.of('coding').on('connection', socket => {
      socket.on('requestAllCode', (token, callback) => {
        controller.getAllCode(token).then(allCode => {
          callback(null, allCode);
        }).catch(err => {
          callback(err);
        });
      });

      socket.on('codeChanged', (position, code, token, callback) => {
        var broadcast = (position, codeObj) => {
          socket.broadcast.emit('codeChanged', position, codeObj);
        };

        controller.onCodeChanged(position, code, token, broadcast).then(codeObj => {
          callback(null, codeObj);
        }).catch(err => {
          callback(err);
        });
      });

      socket.on('codeRemoved', position => {
        var broadcast = position => {
          socket.broadcast.emit('codeRemoved', position);
        };

        controller.onCodeRemoved(position, broadcast);
      });
    });
  }).catch(err => {
    console.log('Cannot initialize coding.', err);
  });
}
