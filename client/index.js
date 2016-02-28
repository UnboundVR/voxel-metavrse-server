var player = require('voxel-player');
var voxel = require('voxel');
var setupCoding = require('./coding');
var setupBlockPlacement = require('./blockPlacement');
var setupControls = require('./controls');
var createClient = require('./voxelClient');
var engineAccessor = require('./engineAccessor');
var auth = require('./auth');
var consts = require('../shared/constants');

var engine;

module.exports = function() {
  auth.init().then(function() {
    var client = createClient(location.host);

    client.socket.on('noMoreChunks', function() {
      engineAccessor.setEngine(client.game);
      engine = engineAccessor.engine;
      var container = document.getElementById('container');

      engine.appendTo(container);
      if (engine.notCapable()) {
        return;
      }

      var createPlayer = player(engine);
      var avatar = createPlayer('assets/avatars/player.png');
      avatar.possess();
      var settings = engine.settings.avatarInitialPosition;
      avatar.position.set(settings[0],settings[1],settings[2]);

      setupCoding(client);
      setupControls(avatar);
      setupBlockPlacement(client);
    });
  });
};
