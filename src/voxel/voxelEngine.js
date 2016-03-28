var blocks = require('./blocks');
var createEngine = require('voxel-engine');

var engine;
var settings;

function getId(pos) {
  return pos.join('|');
}

module.exports = {
  init: function() {
    settings = {
      generate: function(x, y, z) {
        return y === 1 ? 1 : 0;
      },
      chunkDistance: 2,
      materials: blocks.getMaterials(),
      texturePath: 'assets/textures/',
      worldOrigin: [0, 0, 0],
      controls: {discreteFire: true}
    };
    engine = createEngine(settings);
  },
  getInitialChunks: function() {
    // TODO return chunkDistance chunks in every direction
    return engine.chunks;
  },
  getSettings: function() {
    return settings;
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
