import createEngine from 'voxel-engine';
import extend from 'extend';

var engine;
var settings;

function getId(pos) {
  return pos.join('|');
}

function generateWorld(x, y) {
  return y === 1 ? 1 : 0;
}

module.exports = {
  init() {
    settings = {
      generateChunks: true,
      generate: generateWorld,
      chunkDistance: 2,
      worldOrigin: [0, 0, 0]
    };

    engine = createEngine(settings);
  },
  getSettings() {
    return settings;
  },
  getChunk(chunkPos) {
    // Convert from the dictionary-based array to a true array (this assumes the keys in the dict are ordered, which seems to be the case)
    let chunk = extend({}, engine.voxels.chunks[getId(chunkPos)]);
    chunk.voxels = Object.values(chunk.voxels);
    if(!chunk.id) {
      chunk.id = chunk.position.join('|');
    }
    if(!chunk.owners) {
      chunk.owners = [process.env.ADMIN_USER_ID];
    }
    return chunk;
  },
  markAsExistingInDatabase(chunkPos) {
    let chunk = engine.voxels.chunks[getId(chunkPos)];
    chunk.existsInDatabase = true;
  },
  existsInDatabase(chunkPos) {
    let chunk = engine.voxels.chunks[getId(chunkPos)];
    return chunk.existsInDatabase;
  },
  // getAllChunks() {
  //   let chunks = [];
  //   for (let chunk in engine.voxels.chunks) {
  //     let position = engine.voxels.chunks[chunk].position;
  //     chunks.push(this.getChunk(position));
  //   }
  //
  //   return chunks;
  // },
  setManyChunks(chunks) {
    for (let chunk of chunks) {
      this.setChunk(chunk.position, chunk);
    }
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
  },
  setChunk(chunkPos, chunk) {
    // Convert to the format that voxel-engine internally uses to represent chunks (i.e. a dictionary where the keys are the number of the position)
    let voxels = chunk.voxels;
    chunk.voxels = {};
    for(let i = 0; i < voxels.length; i++) {
      chunk.voxels[i] = voxels[i];
    }

    engine.voxels.chunks[getId(chunkPos)] = chunk;
  }
};
