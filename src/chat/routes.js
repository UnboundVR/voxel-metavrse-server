import controller from './controller';

export default{
  init(io) {
    io.of('chat').on('connection', (socket) => {
      socket.on('message', (message) => {
        let broadcast = (message) => {
          socket.broadcast.emit('message', message);
        };

        controller.onMessage(message, broadcast);
      });
    });
  }
}
