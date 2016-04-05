import THREE from 'three';
import consts from '../constants';

var clients = {};

export default {
  getSettings() {
    return {
      initialPosition: consts.playerSync.AVATAR_INITIAL_POSITION,
      lerpPercent: consts.playerSync.LERP_PERCENT
    };
  },
  sendUpdates(broadcast) {
    let clientKeys = Object.keys(clients);
    if (clientKeys.length === 0) {
      return;
    }

    let update = {
      positions: {},
      date: new Date()
    };

    clientKeys.forEach(key =>  {
      let player = clients[key];
      update.positions[key] = {
        position: player.position,
        rotation: {
          x: player.rotation.x,
          y: player.rotation.y
        }
      };
    });

    broadcast(update);
  },
  onJoin(id, broadcast) {
    let player = {
      rotation: new THREE.Vector3(),
      position: new THREE.Vector3()
    };

    let initialPosition = consts.playerSync.AVATAR_INITIAL_POSITION;
    player.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);

    clients[id] = player;

    broadcast(id);
  },
  onLeave(id, broadcast) {
    delete clients[id];
    broadcast(id);
  },
  onState(id, state) {
    let player = clients[id];
    player.rotation.x = state.rotation.x;
    player.rotation.y = state.rotation.y;
    let pos = player.position;
    let distance = pos.distanceTo(state.position);
    if (distance > consts.playerSync.ROUGH_MOVEMENT_THRESHOLD) {
      pos.lerp(state.position, consts.playerSync.LERP_PERCENT);
      return;
    }
    pos.copy(state.position);
  }
};
