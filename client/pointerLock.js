var voxelEngine = require('./voxelEngine');

module.exports = {
  request: function() {
    voxelEngine.engine.interact.request();
  },
  release: function() {
    voxelEngine.engine.interact.release();
  }
};
