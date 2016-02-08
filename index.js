var createGame = require('voxel-engine');
var highlight = require('voxel-highlight');
var player = require('voxel-player');
var voxel = require('voxel');
var extend = require('extend');
var fly = require('voxel-fly');
var walk = require('voxel-walk');

module.exports = function() {
  var opts = {
    generate: voxel.generator['Valley'],
    chunkDistance: 2,
    materials: ['#fff', '#000'],
    materialFlatColor: true,
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true }
  };

  var game = createGame(opts);
  var container = document.getElementById('container');
  window.game = game; // for debugging
  game.appendTo(container);
  if (game.notCapable()) {
    return;
  }

  var createPlayer = player(game);

  // create the player from a minecraft skin file and tell the
  // game to use it as the main player
  var avatar = createPlayer('assets/avatars/player.png');
  avatar.possess();
  avatar.yaw.position.set(2, 14, 4);

  setup(game, avatar);
};

var setup = function(game, avatar) {
  var makeFly = fly(game);
  var target = game.controls.target();
  game.flyer = makeFly(target);

  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase;
  var hl = game.highlighter = highlight(game, { color: 0xff0000 });
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos });
  hl.on('remove', function (voxelPos) { blockPosErase = null });
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos });
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null });

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle();
  });

  // block interaction stuff, uses highlight data
  var currentMaterial = 1;

  game.on('fire', function (target, state) {
    var position = blockPosPlace;
    if (position) {
      game.createBlock(position, currentMaterial);
    }
    else {
      position = blockPosErase;
      if (position) game.setBlock(position, 0);
    }
  });

  game.on('tick', function() {
    walk.render(target.playerSkin);
    var vx = Math.abs(target.velocity.x);
    var vz = Math.abs(target.velocity.z);
    if (vx > 0.001 || vz > 0.001) walk.stopWalking();
    else walk.startWalking();
  });

};
