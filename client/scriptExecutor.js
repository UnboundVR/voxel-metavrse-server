var engineAccessor = require('./engineAccessor');
var blocks = require('../shared/blocks');
var events = require('./events');
var EventEmitter = require('events');

var blockObjs = {};
var blockSpecificEvents = [events.list.HOVER, events.list.LEAVE];

var create = function(position, code) {
  var obj = buildBlockObject(position);
  (new Function(code).bind(obj))();
  blockObjs[position] = obj;
  subscribeToEvents(obj);
};

var update = function(position, code) {
  remove(position);
  create(position, code);
};

var remove = function(position) {
  var obj = blockObjs[position];
  unsubscribeToEvents(obj);
  delete blockObjs[position];
};

function buildBlockObject(position) {
  var engine = engineAccessor.engine;
  var typeNumber = engine.getBlock(position);
  var typeInfo = blocks.getBlockInfo(typeNumber);

  var obj = {
    position: position,
    blockType: typeInfo
  };

  obj.prototype = EventEmitter;

  return obj;
}

function forAllMatchingEvents(obj, callback) {
  Object.keys(events.list).forEach(function(key) {
    var eventName = events.list[key];
    var handlerName = 'on' + eventName;
    var handler = obj[handlerName];
    if(handler) {
      callback(eventName, handler);
    }
  });
}

function subscribeToEvents(obj) {
  forAllMatchingEvents(obj, events.subscribe);
}

function unsubscribeToEvents(obj) {
  forAllMatchingEvents(obj, events.unsubscribe);
}

module.exports = {
  create: create,
  update: update,
  remove: remove
};
