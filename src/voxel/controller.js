import Promise from 'bluebird';
import engine from './voxelEngine';
import compression from './compression';
import extend from 'extend';
import materials from './data/materials.json';
import storage from './storage';
import helper from './helper';
import util from 'util';

export default {
  init(dbConn) {
    return new Promise(async (resolve, reject) => {
      let emptyChunkTable;

      try {
        emptyChunkTable = await storage.getEmptyChunkTable(dbConn);
        engine.init(dbConn, emptyChunkTable).then(data => {
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  initClient() {
    //console.log(util.inspect(engine.getInitialChunks().map(helper.compress), false, null));
    return {
      settings: extend({}, engine.getSettings(), { materials }),
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
