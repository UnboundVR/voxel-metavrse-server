import engine from './voxelEngine';
import compression from './compression';
import extend from 'extend';
import materials from './data/materials.json';
import storage from './storage';
import helper from './helper';

export default {
  async init(dbConn) {
    let emptyChunkTable = await storage.getEmptyChunkTable(dbConn);
    engine.init(dbConn, emptyChunkTable);
  },
  initClient() {
    return {
      settings: extend({}, engine.getSettings(), {materials}),
      chunks: engine.getInitialChunks().map(helper.compress)
    };
  },
  requestChunk(chunkPos) {
    engine.ensureChunkExists(chunkPos);

    let chunk = engine.getChunk(chunkPos);
    return helper.compress(chunk);
  },
  set(pos, val, broadcast) {
    engine.setBlock(pos, val);

    let chunkPos = engine.chunkAtPosition(pos);
    compression.invalidateCache(chunkPos);

    broadcast(pos, val);
  }
};
