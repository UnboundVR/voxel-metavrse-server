var extend = require('extend');
var rle = require('../../shared/rle');

function dictionarize(list, key) {
  var dict = {};
  list.forEach(function(item) {
    dict[item[key]] = item;
  });
  return dict;
}

module.exports = {
  compress: function(chunk, markDirty) {
    var voxels = [];
    chunk.voxels.forEach(function(voxel, index) {
      if(voxel) {
        voxels.push({i: index, v: voxel});
      }
    });

    return extend({}, chunk, {voxels: voxels});
  },
  decompress_old: function(chunk) {
    var voxels = rle.decode(chunk.voxels);
    return extend({}, chunk, {voxels: voxels});
  },
  decompress: function(chunk) {
    var voxels = new Array(chunk.dims[0] * chunk.dims[1] * chunk.dims[2]).fill(0);
    chunk.voxels.forEach(function(obj) {
      voxels[obj.i] = obj.v;
    });

    return extend({}, chunk, {voxels: voxels});
  }
};
