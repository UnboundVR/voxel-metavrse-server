var fly = require('voxel-fly');
var walk = require('voxel-walk');

module.exports = function(game, avatar) {
  var makeFly = fly(game);
  var target = game.controls.target();
  game.flyer = makeFly(target);

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle();
  });

  game.on('tick', function() {
    walk.render(target.playerSkin);
    var vx = Math.abs(target.velocity.x);
    var vz = Math.abs(target.velocity.z);
    if (vx > 0.001 || vz > 0.001) {
      walk.stopWalking();
    } else {
      walk.startWalking();
    }
  });
};
