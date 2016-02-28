var auth = require('./auth');

var messages = document.getElementById('messages');
var socket;
var name;

var enterHandler = function(e) {
  if (e.keyCode !== 13) {
    return;
  }

  var el = document.getElementById('cmd');
  if (document.activeElement === el) {
    socket.emit('message', {user: name, text: el.value});
    el.value = '';
    el.blur();
  } else {
    el.focus();
  }
};

function enable() {
  window.addEventListener('keyup', enterHandler);
}

function disable() {
  window.removeEventListener('keyup', enterHandler);
}

module.exports = {
  enable: enable,
  disable: disable,
  init: function(socketParam) {
    socket = socketParam;
    name = auth.getName() || 'anonymous';
    enable();

    socket.on('message', function(message) {
      var li = document.createElement('li');
      li.innerHTML = message.user + ': ' + message.text;
      messages.appendChild(li);
      messages.scrollTop = messages.scrollHeight;
    });
  }
}
