var io = require('socket.io-client');

var socket;

module.exports = {
  init: function(onMessage) {
    var self = this;
    socket = io.connect(location.host + '/chat');
    socket.on('message', function(message) {
      onMessage(message);
    });
  },
  sendMessage: function(message) {
    socket.emit('message', message);
  }
}
