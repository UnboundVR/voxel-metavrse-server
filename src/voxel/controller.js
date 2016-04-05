import Promise from 'promise';
import storage from './store';
import engine from './voxelEngine';
import compression from './chunkCompression';
import blockTypes from './blockTypes.json';

var dirtyChunks = {};

function isDirty(chunkId) {
  return !!dirtyChunks[chunkId];
}

function markDirty(chunkId) {
  dirtyChunks[chunkId] = true;
}

function markNotDirty(chunkId) {
  dirtyChunks[chunkId] = false;
}

function loadChunkFromStorage(chunkId) {
  return storage.loadChunk(chunkId.replace(/\|/g, '_')).then(chunk => {
    if (chunk) {
      compression.storeInCache(chunk);
      chunk = compression.decompress(chunk);
      engine.setChunk(chunkId, chunk);
      return chunk;
    }
  });
}

function loadInitialChunksFromStorage() {
  let promises = [];
  engine.getExistingChunkIds().forEach(chunkId => {
    promises.push(loadChunkFromStorage(chunkId));
  });
  return Promise.all(promises);
}

function getChunk(chunkId) {
  let chunk = engine.getChunk(chunkId);
  return compression.compress(chunk, markDirty);
}

function ensureChunkExists(chunkId) {
  if (engine.chunkExists(chunkId)) {
    return Promise.resolve();
  } else {
    return loadChunkFromStorage(chunkId).then(chunk => {
      if (!chunk) {
        engine.generateChunk(chunkId);
      }
    });
  }
}

export default {
  init() {
    engine.init();
    return loadInitialChunksFromStorage();
  },
  saveChunks() {
    return Promise.all(engine.getExistingChunkIds().map(chunkId => {
      let chunk = getChunk(chunkId); // this is necessary to ensure all newly compressed chunks are marked dirty
      if (isDirty(chunkId)) {
        return storage.saveChunk(chunkId.replace(/\|/g, '_'), chunk).then(() => {
          markNotDirty(chunkId);
        });
      } else {
        return Promise.resolve();
      }
    }));
  },
  initClient() {
    return {
      settings: engine.getSettings(),
      chunks: engine.getExistingChunkIds().map(getChunk),
      blockTypes: blockTypes
    };
  },
  requestChunk(chunkPos) {
    let chunkId = engine.getChunkId(chunkPos);
    return ensureChunkExists(chunkId).then(() => {
      return getChunk(chunkId);
    });
  },
  set(pos, val, broadcast) {
    engine.setBlock(pos, val);
    let chunkId = engine.getChunkIdAtPosition(pos);
    compression.invalidateCache(chunkId);
    broadcast(pos, val);
  }
};
