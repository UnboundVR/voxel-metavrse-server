import player from 'voxel-player';
import fly from 'voxel-fly';
import walk from 'voxel-walk';
import voxelEngine from '../voxelEngine';

export default function(settings) {
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

  function onTick() {
    walk.render(target.playerSkin);
    var vx = Math.abs(target.velocity.x);
    var vz = Math.abs(target.velocity.z);
    if (vx > 0.001 || vz > 0.001) {
      walk.stopWalking();
    } else {
      walk.startWalking();
    }
  }

  function onKeyDown (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) {
      // toggle between first and third person modes
      avatar.toggle();
      setAvatarVisibility(!avatarVisible);
    }
  }

  var engine = voxelEngine.engine;
  var avatarVisible;

  var createPlayer = player(engine);
  var avatar = createPlayer('assets/avatars/player.png');
  avatar.possess();
  var initialPos = settings.initialPosition;
  avatar.position.set(initialPos[0],initialPos[1],initialPos[2]);

  var makeFly = fly(voxelEngine.engine);
  var target = engine.controls.target();
  engine.flyer = makeFly(target);
  setAvatarVisibility(false);

  window.addEventListener('keydown', onKeyDown);
  engine.on('tick', onTick);
}
