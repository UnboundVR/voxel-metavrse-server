import engine from './voxelEngine';
import compression from './compression';
import extend from 'extend';
import storage from './storage';
import consts from '../constants';

function compress(chunk) {
  let compressedChunk = extend({}, chunk);
  compressedChunk.voxels = compression.compress(chunk.position, chunk.voxels);
  return compressedChunk;
}

let pendingChanges = [];

export default {
  _scheduleDatabaseSave() {
    setTimeout(async () => {
      try {
        await this.saveChunks();
      } catch(err) {
        console.log('Error auto saving chunks', err);
      }
    }, consts.voxel.AUTO_SAVE_INTERVAL);
  },
  async init(dbConn) {
    this._dbConn = dbConn;

    engine.init();

    let chunks = await storage.getChunks(this._dbConn);
    engine.setManyChunks(chunks);

    this._scheduleDatabaseSave();

    return chunks.length;
  },
  async initClient(dbConn) {
    let materials = await storage.getMaterials(dbConn);

    return {
      settings: extend({}, engine.getSettings(), {materials: materials[0].materials}),
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

    let chunk = engine.getChunk(chunkPos);
    pendingChanges.push({pos, val, chunkDims: chunk.dims, chunkPos});

    broadcast(pos, val);
  },
  async saveChunks() {
    let changes = pendingChanges.splice(0, pendingChanges.length);

    console.log(`Saving ${changes.length} chunk changes...`);

    for(let change of changes) {
      try {
        await storage.saveChunkChange(this._dbConn, change.chunkPos, change.chunkDims, change.pos, change.val);
      } catch(err) {
        pendingChanges.unshift(change);
      }
    }

    this._scheduleDatabaseSave();
  }
};
