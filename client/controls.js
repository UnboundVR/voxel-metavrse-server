var fly = require('voxel-fly');
var walk = require('voxel-walk');
var engineAccessor = require('./engineAccessor');

module.exports = function(avatar) {
  var avatarVisible;

  var engine = engineAccessor.engine;

  // TODO instead of doing this, we should probably show/hide the whole object, or place the camera further away (so we can use a mirror for example)
  function setAvatarVisibility(visible) {
    avatar.playerSkin.rightArm.visible = visible;
    avatar.playerSkin.leftArm.visible = visible;
    avatar.playerSkin.rightLeg.visible = visible;
    avatar.playerSkin.leftLeg.visible = visible;
    avatar.playerSkin.head.visible = visible;
    avatar.playerSkin.body.visible = visible;

    avatarVisible = visible;
  }

  var makeFly = fly(engine);
  var target = engine.controls.target();
  engine.flyer = makeFly(target);
  setAvatarVisibility(false);

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) {
      avatar.toggle();
      setAvatarVisibility(!avatarVisible);
    }
  });

  engine.on('tick', function() {
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
