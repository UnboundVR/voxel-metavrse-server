var setupCoding = require('./coding');
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
    chat.init(auth.getName(), socket);
    var client = createClient(socket);

    client.socket.on('noMoreChunks', function() {
      voxelEngine.init(client.game);
      voxelEngine.appendToContainer().then(function() {
        setupAvatar();
        setupCoding(socket);
        setupBlockPlacement(socket);
      }, function() {
        console.log('browser not capable');
      });
    });
  });
};
