var rle = require('../../shared/rle');

var cache = {};

module.exports = {
  invalidateCache: function(chunkId) {
    delete cache[chunkId];
  },
  compress: function(chunk, markDirty) {
    var chunkId = chunk.chunkId;
    if(!cache[chunkId]) {
      cache[chunkId] = rle.encode(chunk.voxels);
      markDirty(chunkId)
    }

    return { // TODO clone with extend and modify voxels prop instead of returning new object
      position: chunk.position,
      dims: chunk.dims,
      chunkId: chunk.chunkId,
      voxels: cache[chunkId]
    };
  },
  decompress: function(chunk) {
    return { // TODO clone with extend and modify voxels prop instead of returning new object
      position: chunk.position,
      dims: chunk.dims,
      chunkId: chunk.chunkId,
      voxels: rle.decode(chunk.voxels)
    };
  }
};
