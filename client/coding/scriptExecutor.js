import voxelEngine from '../voxelEngine';
import blocks from '../blocks';
import events from '../events';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import consts from '../constants';

var blockObjs = {};
var supportedEvents = [consts.events.HOVER, consts.events.LEAVE];

supportedEvents.forEach(eventName => {
  events.on(eventName, function(payload, filter) {
    Object.keys(blockObjs).forEach(key => {
      var block = blockObjs[key];
      block.emit(eventName, payload, filter);
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
  var typeNumber = voxelEngine.getBlock(position);
  var typeInfo = blocks.getBlockInfo(typeNumber);

  var Block = function(position, blockType) {
    this.position = position;
    this.blockType = blockType;
  };
  util.inherits(Block, EventEmitter2.EventEmitter2);

  var obj = new Block(position, typeInfo);
  return obj;
}

function subscribeToEvents(obj) {
  supportedEvents.forEach(eventName => {
    var handlerName = 'on' + eventName;
    var handler = obj[handlerName];
    if(handler) {
      obj.on(eventName, (payload, filter) => {
        if(!filter || !filter.position || obj.position.join('|') == filter.position.join('|')) {
          handler.bind(obj)(payload);
        }
      });
    }
  });
}

function unsubscribeToEvents(obj) {
  supportedEvents.forEach(eventName => {
    obj.removeAllListeners(eventName);
  });
}

export default {
  create: create,
  update: update,
  remove: remove,
  confirm: confirm
};
