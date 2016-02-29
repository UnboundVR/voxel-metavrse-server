var rle = require('../../shared/rle');
var engine = require('../services/voxelEngine');

var cache = {};

module.exports = {
  storeInCache: function(chunk) {
    var chunkId = engine.getChunkId(chunk.position);
    cache[chunkId] = chunk.voxels;
  },
  invalidateCache: function(chunkId) {
    delete cache[chunkId];
  },
  compress: function(chunk, markDirty) {
    var chunkId = engine.getChunkId(chunk.position);

    if(!cache[chunkId]) {
      cache[chunkId] = rle.encode(chunk.voxels);
      markDirty(chunkId);
    }

    return { // TODO clone with extend and modify voxels prop instead of returning new object
      position: chunk.position,
      dims: chunk.dims,
      voxels: cache[chunkId]
    };
  },
  decompress: function(chunk) {
    return { // TODO clone with extend and modify voxels prop instead of returning new object
      position: chunk.position,
      dims: chunk.dims,
      voxels: rle.decode(chunk.voxels)
    };
  }
};
