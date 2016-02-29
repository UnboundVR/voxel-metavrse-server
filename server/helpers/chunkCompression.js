var rle = require('../../shared/rle');
var engine = require('../services/voxelEngine');
var extend = require('extend');

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

    var voxels = cache[chunkId];
    return extend({}, chunk, {voxels: voxels});
  },
  decompress: function(chunk) {
    var voxels = rle.decode(chunk.voxels);
    return extend({}, chunk, {voxels: voxels});
  }
};
