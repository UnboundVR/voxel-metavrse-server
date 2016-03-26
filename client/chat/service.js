import io from 'socket.io-client';
import EventEmitter2 from 'eventemitter2';
import util from 'util';

function ChatService() {
  this.init = function() {
    var self = this;
    this.socket = io.connect(location.host + '/chat');
    this.socket.on('message', message => {
      self.emit('message', message);
    });
  };

  this.sendMessage = function(message) {
    this.socket.emit('message', message);
  };
}

util.inherits(ChatService, EventEmitter2.EventEmitter2);
export default new ChatService();
