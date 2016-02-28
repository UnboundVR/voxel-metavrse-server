var coding = require('./coding');
var setupBlockPlacement = require('./blockPlacement');
var setupAvatar = require('./avatar');
var createClient = require('./voxelClient');
var voxelEngine = require('./voxelEngine');
var auth = require('./auth');
var chat = require('./chat');
var consts = require('../shared/constants');
var io = require('socket.io-client');

module.exports = function() {
  auth.init().then(function() {
    var socket = io.connect(location.host);

    var client = createClient(socket, function() {
      voxelEngine.init(client.game);
      voxelEngine.appendToContainer().then(function() {
        setupAvatar();
        setupBlockPlacement(socket);
        coding.init(socket);
        chat.init(socket);
      }, function() {
        console.log('browser not capable');
      });
    });
  });
};
