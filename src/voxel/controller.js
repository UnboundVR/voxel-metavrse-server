import Promise from 'bluebird';
import engine from './voxelEngine';
import compression from './compression';
import extend from 'extend';
import materials from './data/materials.json';
import storage from './storage';

function compress(chunk) {
  let compressedChunk = extend({}, chunk);
  compressedChunk.voxels = compression.compress(chunk.position, chunk.voxels);
  return compressedChunk;
}

export default {
  init: async function(dbConn) {
    engine.init();

    let chunks = await storage.getChunks(dbConn);
    engine.setManyChunks(chunks);
    
    return chunks.length;
  },
  initClient() {
    return {
      settings: extend({}, engine.getSettings(), { materials }),
      chunks: engine.getInitialChunks().map(compress)
    };
  },
  requestChunk(chunkPos) {
    engine.ensureChunkExists(chunkPos);

    let chunk = engine.getChunk(chunkPos);
    return compress(chunk);
  },
  set(pos, val, broadcast) {
    engine.setBlock(pos, val);

    let chunkPos = engine.chunkAtPosition(pos);
    compression.invalidateCache(chunkPos);

    broadcast(pos, val);
  }
};
