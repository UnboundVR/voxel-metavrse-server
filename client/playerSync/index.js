import setupAvatar from './avatar';
import voxelEngine from '../voxelEngine';
import skin from 'minecraft-skin';
import io from 'socket.io-client';

var socket;

export default {
  init() {
    var self = this;

    socket = io.connect(location.host + '/playerSync');
    socket.on('connect', () => {
      self.playerId = socket.id;
    });

    socket.on('settings', settings => {
      self.settings = settings;
      self.others = {};

      function sendState() {
        if (!socket.connected) {
          return;
        }
        var player = voxelEngine.engine.controls.target();
        var state = {
          position: player.yaw.position,
          rotation: {
            y: player.yaw.rotation.y,
            x: player.pitch.rotation.x
          }
        };
        socket.emit('state', state);
      }

      voxelEngine.engine.controls.on('data', state => {
        var interacting = false;
        Object.keys(state).map(control => {
          if (state[control] > 0) {
            interacting = true;
          }
        });

        if (interacting) {
          sendState();
        }
      });

      // setTimeout is because three.js seems to throw errors if you add stuff too soon
      setTimeout(() => {
        socket.on('update', updates => {
          Object.keys(updates.positions).map(player => {
            var update = updates.positions[player];
            if (player === self.playerId) {
              return self.onServerUpdate(update); // local player
            }
            self.updatePlayerPosition(player, update); // other players
          });
        });
      }, 1000);

      socket.on('leave', id => {
        if (!self.others[id]) {
          return;
        }
        voxelEngine.engine.scene.remove(self.others[id].mesh);
        delete self.others[id];
      });

      setupAvatar(settings);
    });
  },
  onServerUpdate(update) {
    // TODO use server sent location
  },
  updatePlayerPosition(id, update) {
    function scale( x, fromLow, fromHigh, toLow, toHigh ) {
      return ( x - fromLow ) * ( toHigh - toLow ) / ( fromHigh - fromLow ) + toLow;
    }

    var pos = update.position;
    var player = this.others[id];
    if (!player) {
      let playerSkin = skin(voxelEngine.engine.THREE, 'assets/avatars/player.png', {
        scale: new voxelEngine.engine.THREE.Vector3(0.04, 0.04, 0.04)
      });
      let playerMesh = playerSkin.mesh;
      this.others[id] = playerSkin;
      playerMesh.children[0].position.y = 10;
      voxelEngine.engine.scene.add(playerMesh);
    }

    let playerSkin = this.others[id];
    let playerMesh = playerSkin.mesh;
    playerMesh.position.copy(playerMesh.position.lerp(pos, this.settings.lerpPercent));

    playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2);
    playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75);
  }
};
