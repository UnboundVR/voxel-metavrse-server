var highlight = require('voxel-highlight');
var engineAccessor = require('./engineAccessor');
var events = require('./events');
var consts = require('../shared/constants');

var blockPosPlace, blockPosEdit;

module.exports = {
  init: function() {
    var engine = engineAccessor.engine;
    var hl = engine.highlighter = highlight(engine, {
      color: 0xff0000
    });

    hl.on('highlight', function (voxelPos) {
      blockPosEdit = voxelPos;
      events.emit(consts.events.HOVER, {position: voxelPos});
    });

    hl.on('remove', function (voxelPos) {
      blockPosEdit = null;
      events.emit(consts.events.LEAVE, {position: voxelPos});
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
