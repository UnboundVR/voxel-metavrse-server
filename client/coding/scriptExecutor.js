var engineAccessor = require('../engineAccessor');
var blocks = require('../../shared/blocks');
var events = require('../events');
var EventEmitter = require('events');
var util = require('util');
var consts = require('../../shared/constants');

var blockObjs = {};
var supportedEvents = [consts.events.HOVER, consts.events.LEAVE];

supportedEvents.forEach(function(eventName) {
  events.on(eventName, function(payload) {
    Object.keys(blockObjs).forEach(function(key) {
      var block = blockObjs[key];
      block.emit(eventName, payload);
    });
  });
});

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
  if(obj) {
    unsubscribeToEvents(obj);
    delete blockObjs[position];
  }
};

var confirm = function(position, action) {
  var obj = blockObjs[position];
  if(!obj) {
    return true;
  }

  var confirmFuncName = 'can' + action;
  var confirmFunc = obj[confirmFuncName];

  return !confirmFunc || confirmFunc();
};

function buildBlockObject(position) {
  var engine = engineAccessor.engine;
  var typeNumber = engine.getBlock(position);
  var typeInfo = blocks.getBlockInfo(typeNumber);

  var Block = function(position, blockType) {
    this.position = position;
    this.blockType = blockType;
  }
  util.inherits(Block, EventEmitter);

  var obj = new Block(position, typeInfo);
  return obj;
}

function subscribeToEvents(obj) {
  supportedEvents.forEach(function(eventName) {
    var handlerName = 'on' + eventName;
    var handler = obj[handlerName];
    if(handler) {
      obj.on(eventName, function(payload) {
        if(!payload.position || obj.position.join('|') == payload.position.join('|')) {
          handler.bind(obj)(payload);
        }
      });
    }
  });
}

function unsubscribeToEvents(obj) {
  supportedEvents.forEach(function(eventName) {
    obj.removeAllListeners(eventName);
  });
}

module.exports = {
  create: create,
  update: update,
  remove: remove,
  confirm: confirm
};
