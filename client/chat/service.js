var io = require('socket.io-client');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

function ChatService() {}

ChatService.prototype.init = function() {
  this.socket = io.connect(location.host + '/chat');
  this.socket.on('message', function(message) {
    this.emit('message', message);
  });
};

ChatService.prototype.init = function(message) {
  this.socket.emit('message', message);
};

util.inherits(ChatService, EventEmitter2);
module.exports = new ChatService();
