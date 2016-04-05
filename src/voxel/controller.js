import engine from './voxelEngine';
import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import compression from './compression';

export default {
  init() {
    engine.init();
  },
  initClient() {
    return {
      settings: engine.getSettings(),
      chunks: engine.getInitialChunks(),
      materials,
      itemTypes,
      blockTypes
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
