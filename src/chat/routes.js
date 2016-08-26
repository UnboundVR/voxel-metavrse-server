import controller from './controller';

export default{
  init(io) {
    io.of('chat').on('connection', (socket) => {
      socket.on('message', (message) => {
        let broadcast = (message) => {
          socket.broadcast.emit('message', message);
        };

        try {
          controller.onMessage(message, broadcast);
        } catch(err) {
          console.log('Error broadcasting chat message', err);
        }
      });
    });
  }
};
