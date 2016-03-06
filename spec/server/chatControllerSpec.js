var test = require('tape');
var sinon = require('sinon');
var chat = require('../../server/chat/controller');
var consts = require('../../shared/constants');

test('empty messages should be ignored', function(t) {
  var msg = {text: ''};
  var broadcast = sinon.spy();

  chat.onMessage(msg, broadcast);
  t.ok(!broadcast.called, 'broadcast is not called');
  t.end();
});

test('non-empty messages should be broadcasted', function(t) {
  var text = 'a'.repeat(consts.chat.MAX_MSG_LENGTH / 2);
  var msg = {text: text};
  var broadcast = sinon.spy();

  chat.onMessage(msg, broadcast);
  t.ok(broadcast.calledWith({text: text}), 'message is broadcasted as is');
  t.end();
});

test('long messages should be trimmed', function(t) {
  var text = 'a'.repeat(consts.chat.MAX_MSG_LENGTH + 2);
  var msg = {text: text};
  var broadcast = sinon.spy();

  chat.onMessage(msg, broadcast);
  t.ok(broadcast.calledWith({text: text.substr(0, consts.chat.MAX_MSG_LENGTH)}), 'message is broadcasted trimmed to max length');
  t.end();
});
