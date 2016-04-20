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
    let emptyChunkTable = await storage.getEmptyChunkTable(dbConn);
    engine.init(dbConn, emptyChunkTable);

    if (emptyChunkTable) {
      return storage.saveChunks(dbConn, engine.getAllChunks());

      console.log('initializing db from in-memory chunks')
    } else {
      let chunks = await storage.getChunks(dbConn);

      for (let chunk of chunks) {
        engine.setChunk(chunk.position, chunk);
      }

      console.log(`loaded ${chunks.length} chunks from DB`);
    }
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
