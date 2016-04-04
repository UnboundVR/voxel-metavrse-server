import rle from './rle';
import engine from './voxelEngine';
import extend from 'extend';

var cache = {};

export default {
  storeInCache(chunk) {
    let chunkId = engine.getChunkId(chunk.position);
    cache[chunkId] = chunk.voxels;
  },
  invalidateCache(chunkId) {
    delete cache[chunkId];
  },
  compress(chunk, markDirty) {
    let chunkId = engine.getChunkId(chunk.position);

    if (!cache[chunkId]) {
      cache[chunkId] = rle.encode(chunk.voxels);
      markDirty(chunkId);
    }

    let voxels = cache[chunkId];
    return extend({}, chunk, {voxels: voxels});
  },
  decompress(chunk) {
    let voxels = rle.decode(chunk.voxels);
    return extend({}, chunk, {voxels: voxels});
  }
};
