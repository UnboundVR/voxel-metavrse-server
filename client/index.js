var player = require('voxel-player');
var voxel = require('voxel');
var gists = require('./gists');
var executor = require('./scriptExecutor');
var setupBlockPlacement = require('./blockPlacement');
var setupControls = require('./controls');
var createClient = require('./client');

var game;

module.exports = function() {
  var client = createClient('http://localhost:8080');

  client.socket.on('noMoreChunks', function() {
    game = client.game;
    window.game = game;
    var container = document.getElementById('container');

    game.appendTo(container);
    if (game.notCapable()) {
      return;
    }

    var createPlayer = player(game);
    var avatar = createPlayer('assets/avatars/player.png');
    avatar.possess();
    var settings = game.settings.avatarInitialPosition;
    avatar.position.set(settings[0],settings[1],settings[2]);

    initGists(client);
    setupControls(game, avatar);
    setupBlockPlacement(game, client);
  });
};

var initGists = function(client) {
  gists.init(client.socket).then(function() {
    gists.getBlocksWithGists().forEach(function(block) {
      block.script.then(function(response) {
        executor.create(block.position, response.code);
        game.setBlock(block.position, 2);
      }, function(error) {
        console.log('cannot load script in ' + block.position.join('|') + ' from github');
        game.setBlock(block.position, 2);
      });
    });
  });
};
