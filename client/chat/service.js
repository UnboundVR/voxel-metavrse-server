var io = require('socket.io-client');

var socket;

module.exports = {
  init: function(onMessage) {
    return new Promise(function(resolve, reject) {
      var self = this;
      socket = io.connect(location.host + '/chat');
      socket.on('message', function(message) {
        onMessage(message);
      });
      resolve();
    });
  },
  sendMessage: function(message) {
    socket.emit('message', message);
  },
};
