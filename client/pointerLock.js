var voxelEngine = require('./voxelEngine');
var pointerLock = require('pointer-lock');

module.exports = {
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
