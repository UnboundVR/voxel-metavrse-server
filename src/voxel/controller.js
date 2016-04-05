import engine from './voxelEngine';
import compression from './compression';

export default {
  init() {
    engine.init();
  },
  initClient() {
    return {
      settings: engine.getSettings(),
      chunks: engine.getInitialChunks()
    };
  },
  requestChunk(chunkPos) {
    engine.ensureChunkExists(chunkPos);

    let chunk = engine.getChunk(chunkPos);
    return compression.compress(chunk);
  },
  set(pos, val, broadcast) {
    engine.setBlock(pos, val);

    let chunkPos = engine.chunkAtPosition(pos);
    compression.invalidateCache(chunkPos);

    broadcast(pos, val);
  }
};
