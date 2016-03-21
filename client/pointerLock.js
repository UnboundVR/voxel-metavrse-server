import voxelEngine from './voxelEngine';

export default {
  request: function() {
    voxelEngine.engine.interact.request();
  },
  release: function() {
    voxelEngine.engine.interact.release();
  }
};
