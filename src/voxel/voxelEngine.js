import blocks from './blocks';
import createEngine from 'voxel-engine';

var engine;
var settings;

export default {
  init() {
    settings = {
      generate(x, y, z) {
        return y === 1 ? 1 : 0;
      },
      chunkDistance: 2,
      materials: blocks.getMaterials(),
      texturePath: 'assets/textures/',
      worldOrigin: [0, 0, 0],
      controls: { discreteFire: true }
    };
    engine = createEngine(settings);
  },
  getSettings() {
    return settings;
  },
  getChunkId(chunkPos) {
    return chunkPos.join('|');
  },
  getChunkIdAtPosition(pos) {
    return this.getChunkId(engine.voxels.chunkAtPosition(pos));
  },
  getChunk(chunkId) {
    return engine.voxels.chunks[chunkId];
  },
  setChunk(chunkId, chunk) {
    engine.voxels.chunks[chunkId] = chunk;
  },
  chunkExists(chunkId) {
    return !!engine.voxels.chunks[chunkId];
  },
  getExistingChunkIds() {
    return Object.keys(engine.voxels.chunks);
  },
  setBlock(pos, val) {
    engine.setBlock(pos, val);
  },
  generateChunk(chunkId) {
    engine.pendingChunks.push(chunkId);
    engine.loadPendingChunks(engine.pendingChunks.length);
  }
};
