var EventEmitter = require('events');
var emitter = new EventEmitter();
var events = {
  HOVER: 'Hover',
  LEAVE: 'Leave'
};

module.exports = {
  list: events,
  subscribe: function(e, handler) {
    emitter.on(e, handler);
  },
  unsubscribe: function(e, handler) {
    emitter.removeListener(e, handler);
  },
  publish: function(e, payload) {
    emitter.emit(e, payload);
  }
};
