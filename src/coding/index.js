import controller from './controller';

export default function(io) {
  io.of('coding').on('connection', socket => {

    socket.on('requestAllCode', (token, callback) => {
      controller.getAllCode(token).then(allCode => {
        callback(null, allCode);
      }).catch(callback);
    });

    socket.on('codeChanged', (position, code, token, callback) => {
      let broadcast = (position, codeObj) => {
        socket.broadcast.emit('codeChanged', position, codeObj);
      };

      controller.onCodeChanged(position, code, token, broadcast).then(codeObj => {
        callback(null, codeObj);
      }).catch(callback);
    });

    socket.on('codeRemoved', function(position) {
      let broadcast = position => {
        socket.broadcast.emit('codeRemoved', position);
      };

      controller.onCodeRemoved(position, broadcast);
    });
  });
}
