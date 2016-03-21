import events from '../events';
import consts from '../../shared/constants';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import pointerLock from '../pointerLock';

const CODING_WINDOW = 'coding';

var dirty = false;
var onSave;

var doClose = function() {
  var crosshair = document.getElementById('crosshair');
  var chatElement = document.getElementById('chat');
  var toolbar = document.getElementById('toolbar');
  var userInfo = document.getElementById('userInfo');
  crosshair.style.display = 'block';
  toolbar.style.display = 'block';
  userInfo.style.display = 'block';
  chatElement.style.display = 'block';

  pointerLock.request();
  events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: CODING_WINDOW});
};

var save = function(value) {
  onSave(value);
  doClose();
  onSave = undefined;
};

var close = function() {
  if(!dirty || confirm('Exit without saving?')) {
    doClose();
  }
};

var open = function(data) {
  var crosshair = document.getElementById('crosshair');
  var chatElement = document.getElementById('chat');
  var toolbar = document.getElementById('toolbar');
  var userInfo = document.getElementById('userInfo');
  crosshair.style.display = 'none';
  toolbar.style.display = 'none';
  userInfo.style.display = 'none';
  chatElement.style.display = 'none';

  this.emit('open', data);
  pointerLock.release();
  events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: CODING_WINDOW});

  return new Promise(function(resolve) {
    onSave = resolve;
  });
};

function Editor() {
  this.save = save.bind(this);
  this.close = close.bind(this);
  this.open = open.bind(this);
  this.onChange = function() {
    dirty = true;
  };
  this.markClean = function() {
    dirty = false;
  };
}

util.inherits(Editor, EventEmitter2.EventEmitter2);
export default new Editor();
