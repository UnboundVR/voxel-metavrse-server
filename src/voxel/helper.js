import compression from './compression';
import extend from 'extend';

export default {
  compress(chunk) {
    let compressedChunk = extend({}, chunk);
    compressedChunk.voxels = compression.compress(chunk.position, chunk.voxels);
    return compressedChunk;
  }
};
