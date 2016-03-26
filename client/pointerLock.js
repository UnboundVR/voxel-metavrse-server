import voxelEngine from './voxelEngine';
var pointerLock = require('pointer-lock');

export default {
  request: function() {
    voxelEngine.engine.interact.request();
  },
  release: function() {
    voxelEngine.engine.interact.release();
  },
  available: function() {
    return pointerLock.available();
  }
};
