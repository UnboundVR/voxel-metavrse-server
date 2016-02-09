var createGame = require('voxel-engine');
var player = require('voxel-player');
var voxel = require('voxel');
var texturePath = require('painterly-textures');
var blocks = require('./blocks');
var executor = require('./scriptExecutor');
var setupBlockPlacement = require('./blockPlacement');
var setupControls = require('./controls');

module.exports = function() {
  count = 0;
  var opts = {
    generate: function(x, y, z) {
      return y === 1 ? 1 : 0
    },
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    texturePath: texturePath(),
    materials: [['grass', 'dirt', 'grass_dirt'], 'obsidian']
  };

  var game = createGame(opts);
  var container = document.getElementById('container');
  window.game = game; // for debugging
  game.appendTo(container);
  if (game.notCapable()) {
    return;
  }

  var createPlayer = player(game);
  var avatar = createPlayer('assets/avatars/player.png');
  avatar.possess();
  avatar.yaw.position.set(2, 14, 4);

  setupControls(game, avatar);
  setupBlockPlacement(game);
  loadBlocksWithScripts();
};

var loadBlocksWithScripts = function() {
  blocks.getBlocksWithGists().forEach(function(block) {
    block.script.then(function(response) {
      executor.create(block.position, response.code);
      game.setBlock(block.position, 2);
    });
  });
};
