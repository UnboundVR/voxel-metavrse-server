import voxelEngine from './voxelEngine';
var pointerLock = require('pointer-lock');

export default {
  request() {
    voxelEngine.engine.interact.request();
  },
  release() {
    voxelEngine.engine.interact.release();
  },
  available() {
    return pointerLock.available();
  }
};
