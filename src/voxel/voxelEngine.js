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
      generate: function(x, y) {
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
    var initialPositions = [];
    for(var i = -1; i < 1; i++) {
      for(var j = -1; j < 1; j++) {
        for(var k = -1; k < 1; k++) {
          initialPositions.push([i,j,k]);
        }
      }
    }
    return initialPositions.map(this.getChunk);
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
