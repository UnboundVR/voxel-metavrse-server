import createEngine from 'voxel-engine';
import storage from './storage';
import helper from './helper';

var engine;
var settings;

function getId(pos) {
  return pos.join('|');
}

module.exports = {
  init(dbConn, emptyChunkTable) {
    settings = {
      // Empty table means we don't generate new chunks, we use them from the db.
      generateChunks: emptyChunkTable ? true : false,
      generate: function(x, y) {
        return y === 1 ? 1 : 0;
      },
      chunkDistance: 2,
      worldOrigin: [0, 0, 0]
    };
    engine = createEngine(settings);

    if (emptyChunkTable) {
      storage.saveChunks(dbConn, this.getCompressedChunks());
    }
  },
  getSettings() {
    return settings;
  },
  getInitialChunks() {
    let initialPositions = [];
    for(var i = -1; i < 1; i++) {
      for(var j = -1; j < 1; j++) {
        for(var k = -1; k < 1; k++) {
          initialPositions.push([i,j,k]);
        }
      }
    }
    return initialPositions.map(this.getChunk);
  },
  getChunk(chunkPos) {
    return engine.voxels.chunks[getId(chunkPos)];
  },
  getCompressedChunks() {
    let compressedChunks = [];
    for (let chunk in engine.voxels.chunks) {
      if (engine.voxels.chunks.hasOwnProperty(chunk)) {
        compressedChunks.push(helper.compress(engine.voxels.chunks[chunk]));
      }
    }

    return compressedChunks;
  },
  setBlock(pos, val) {
    engine.setBlock(pos, val);
  },
  chunkAtPosition(pos) {
    return engine.voxels.chunkAtPosition(pos);
  },
  ensureChunkExists(chunkPos) {
    let chunkId = getId(chunkPos);
    if(!engine.voxels.chunks[chunkId]) {
      engine.pendingChunks.push(chunkId);
      engine.loadPendingChunks(engine.pendingChunks.length);
    }
  }
};
