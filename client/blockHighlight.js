var highlight = require('voxel-highlight');

var blockPosPlace, blockPosEdit;

module.exports = {
  init: function() {
    // highlight blocks when you look at them, hold <Ctrl> for block placement
    var hl = game.highlighter = highlight(game, { color: 0xff0000 });

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
