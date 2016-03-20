var io = require('socket.io-client');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

var socket;

function ChatService() {

}

ChatService.prototype.init = function() {
  socket = io.connect(location.host + '/chat');
  socket.on('message', function(message) {
    this.emit('message', message);
  });
};

ChatService.prototype.init = function(message) {
  socket.emit('message', message);
};

util.inherits(ChatService, EventEmitter2);

module.exports = new ChatService();
