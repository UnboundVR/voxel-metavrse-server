var highlight = require('voxel-highlight');
var engineAccessor = require('./engineAccessor');

var blockPosPlace, blockPosEdit;

module.exports = {
  init: function() {
    var engine = engineAccessor.engine;

    // highlight blocks when you look at them, hold <Ctrl> for block placement
    var hl = engine.highlighter = highlight(engine, { color: 0xff0000 });

    hl.on('highlight', function (voxelPos) {
      blockPosEdit = voxelPos;
    });

    hl.on('remove', function (voxelPos) {
      blockPosEdit = null;
    });

    hl.on('highlight-adjacent', function (voxelPos) {
      blockPosPlace = voxelPos;
    });

    hl.on('remove-adjacent', function (voxelPos) {
      blockPosPlace = null;
    });
  },
  getPlacePosition: function() {
    return blockPosPlace;
  },
  getEditPosition: function() {
    return blockPosEdit;
  }
};
