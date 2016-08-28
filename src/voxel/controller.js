import engine from './voxelEngine';
import compression from './compression';
import extend from 'extend';
import storage from './storage';
import consts from '../constants';
import auth from '../auth';

function compress(chunk) {
  let compressedChunk = extend({}, chunk);
  compressedChunk.voxels = compression.compress(chunk.position, chunk.voxels);
  return compressedChunk;
}

async function hasAccess(chunk, token) {
  let user = await auth.getUser(token);
  return user && chunk.owners.includes(user.id);
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
    for(let chunk of chunks) {
      chunk.existsInDatabase = true;
    }
    engine.setManyChunks(chunks);

    this._scheduleDatabaseSave();

    return chunks.length;
  },
  async initClient(dbConn) {
    let materials = (await storage.getMaterials(dbConn)).sort((m1, m2) => m1.id > m2.id).map(m => m.textures);
    return {
      settings: extend({}, engine.getSettings(), {
        materials,
        initialPosition: consts.playerSync.AVATAR_INITIAL_POSITION
      })
    };
  },
  requestChunk(chunkPos) {
    engine.ensureChunkExists(chunkPos);

    let chunk = engine.getChunk(chunkPos);
    return compress(chunk);
  },
  async set(token, pos, val, broadcast) {
    let chunkPos = engine.chunkAtPosition(pos);
    let chunk = engine.getChunk(chunkPos);

    if(await hasAccess(chunk, token)) {
      engine.setBlock(pos, val);
      compression.invalidateCache(chunkPos);
      pendingChanges.push({pos, val, chunkDims: chunk.dims, chunkPos});
      broadcast(pos, val);
    } else {
      throw new Error(`User does not have access to chunk at ${chunkPos}`);
    }
  },
  async saveChunks() {
    let changes = pendingChanges.splice(0, pendingChanges.length);

    if(changes.length) {
      console.log(`Saving ${changes.length} chunk changes...`);
    }

    let addedChunks = [];

    for(let change of changes) {
      try {
        if(!engine.existsInDatabase(change.chunkPos)) {
          let chunk = engine.getChunk(change.chunkPos);
          await storage.saveChunk(this._dbConn, chunk);
          engine.markAsExistingInDatabase(change.chunkPos);
          addedChunks.push(change.chunkPos);
          console.log(`Chunk at ${chunk.id} didn't exist in database, so we're adding it`);
        } else {
          // We're not sending the delta if we just sent the whole chunk
          if(!addedChunks.includes(change.chunkPos)) {
            await storage.saveChunkChange(this._dbConn, change.chunkPos, change.chunkDims, change.pos, change.val);
          }
        }
      } catch(err) {
        console.log('Error saving chunk change', err);
        pendingChanges.unshift(change);
      }
    }

    this._scheduleDatabaseSave();
  }
};
