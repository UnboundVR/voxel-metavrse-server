var client = require('./voxelClient');
var auth = require('./auth');
var coding = require('./coding');
var blockPlacement = require('./blockPlacement');
var playerSync = require('./playerSync');
var voxelEngine = require('./voxelEngine');
var chat = require('./chat');
var consts = require('../shared/constants');
var io = require('socket.io-client');

module.exports = function() {
  auth.init().then(function() {
    var socket = io.connect(location.host);

    client.init(socket).then(function() {
      voxelEngine.init(client.engine);
      voxelEngine.appendToContainer().then(function() {
        blockPlacement.init(socket);
        playerSync.init(socket);
        coding.init(socket);
        chat.init(socket);
      }, function() {
        console.log('browser not capable');
      });
    });
  });
};
