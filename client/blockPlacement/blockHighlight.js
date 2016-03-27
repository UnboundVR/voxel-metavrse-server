import highlight from 'voxel-highlight';
import voxelEngine from '../voxelEngine';
import events from '../events';
import consts from '../constants';

var blockPosPlace, blockPosEdit;

export default {
  init() {
    var hl = voxelEngine.engine.highlighter = highlight(voxelEngine.engine, {
      color: 0xff0000
    });

    hl.on('highlight', function (voxelPos) {
      blockPosEdit = voxelPos;
      events.emit(consts.events.HOVER, {}, {position: voxelPos});
    });

    hl.on('remove', function (voxelPos) {
      blockPosEdit = null;
      events.emit(consts.events.LEAVE, {}, {position: voxelPos});
    });

    hl.on('highlight-adjacent', function (voxelPos) {
      blockPosPlace = voxelPos;
    });

    hl.on('remove-adjacent', function () {
      blockPosPlace = null;
    });
  },
  getPlacePosition() {
    return blockPosPlace;
  },
  getEditPosition() {
    return blockPosEdit;
  }
};
