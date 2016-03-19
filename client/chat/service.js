var io = 'socket.io-client';

var socket;

module.exports = {
  init: function(onMessage) {
    this.messageList = [];

    socket = io.connect(location.host + '/chat');
    socket.on('message', function(message) {
      this.messageList.push(message);
    });
  },
  sendMessage: function(message) {
    this.messageList.push(message);
    socket.emit('message', message);
  }
}
