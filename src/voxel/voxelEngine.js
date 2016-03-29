var createEngine = require('voxel-engine');

var engine;
var settings;

function getId(pos) {
  return pos.join('|');
}

module.exports = {
  init: function() {
    settings = {
      generateChunks: true,
      generate: function(x, y, z) {
        return y === 1 ? 1 : 0;
      },
      chunkDistance: 2,
      worldOrigin: [0, 0, 0]
    };
    engine = createEngine(settings);
  },
  getSettings: function() {
    return settings;
  },
  getInitialChunks: function() {
    return [this.getChunk(this.chunkAtPosition(settings.worldOrigin))]; // returns just the center chunk for now
  },
  getChunk: function(chunkPos) {
    return engine.voxels.chunks[getId(chunkPos)];
  },
  setBlock: function(pos, val) {
    engine.setBlock(pos, val);
  },
  chunkAtPosition: function(pos) {
    return engine.voxels.chunkAtPosition(pos);
  },
  ensureChunkExists(chunkPos) {
    var chunkId = getId(chunkPos);
    if(!engine.voxels.chunks[chunkId]) {
      engine.pendingChunks.push(chunkId);
      engine.loadPendingChunks(engine.pendingChunks.length);
    }
  }
};
