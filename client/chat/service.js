var io = require('socket.io-client');

var socket;

module.exports = {
  init: function(onMessage) {
    this.messageList = []; // this doesn't work

    var self = this;
    socket = io.connect(location.host + '/chat');
    socket.on('message', function(message) {
      self.messageList.push(message);
    });
  },
  sendMessage: function(message) {
    this.messageList.push(message);
    socket.emit('message', message);
  }
}
