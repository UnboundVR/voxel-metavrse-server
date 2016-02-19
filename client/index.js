var player = require('voxel-player');
var voxel = require('voxel');
var coding = require('./coding/coding');
var executor = require('./coding/scriptExecutor');
var setupBlockPlacement = require('./blockPlacement');
var setupControls = require('./controls');
var createClient = require('./voxelClient');
var engineAccessor = require('./engineAccessor');
var auth = require('./auth');
var consts = require('../shared/constants');

var engine;

module.exports = function() {
  auth.init();
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

    initGists(client);
    setupControls(avatar);
    setupBlockPlacement(client);
  });
};

var initGists = function(client) {
  coding.init(client.socket).then(function() {
    coding.getBlocksWithGists().forEach(function(block) {
      block.script.then(function(response) {
        executor.create(block.position, response.code);
        engine.setBlock(block.position, 2);
      }, function(error) {
        console.log('cannot load script in ' + block.position.join('|') + ' from github');
        engine.setBlock(block.position, 2);
      });
    });
  });
};
