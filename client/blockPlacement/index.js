import highlight from './blockHighlight';
import blocks from '../blocks';
import coding from '../coding';
import toolbar from '../toolbar';
import voxelEngine from '../voxelEngine';
import consts from '../constants';
import getAdjacent from './getAdjacentPositions';
import voxelClient from '../voxelClient';

export default {
  init() {
    highlight.init();

    function adjacentToTrollBlock(position) {
      var adj = getAdjacent(position);

      for(var i = 0; i < adj.length; i++) {
        var pos = adj[i];
        if(voxelEngine.isOfType(pos, blocks.types.TROLL.number)) {
          return true;
        }
      }

      return false;
    }

    function placeBlock(position) {
      voxelEngine.createBlock(position, toolbar.getSelected());
      voxelClient.setBlock(position, toolbar.getSelected());
    }

    function codeBlock(position) {
      coding.editCode(position).then(() => {
        voxelEngine.setBlock(position, blocks.types.CODE.number);
      }, err => {
        alert(err);
      });
    }

    function removeBlock(position) {
      coding.removeCode(position);
      voxelEngine.clearBlock(position);
      voxelClient.clearBlock(position);
    }

    function canPlace(position) {
      if(adjacentToTrollBlock(position)) {
        alert('problem?');
        return false;
      }

      var adjPositions = getAdjacent(position);
      var canPlace = true;

      adjPositions.forEach(adjPos => {
        canPlace = canPlace && coding.confirm(adjPos, consts.confirmableFunctions.PLACE_ADJACENT);
      });

      return canPlace;
    }

    function canEdit(position) {
      if(voxelEngine.isOfType(position, blocks.types.TILE.number)) {
        return false;
      }

      if(voxelEngine.isOfType(position, blocks.types.TROLL.number)) {
        alert('the troll must go on');
        return false;
      }

      if(voxelEngine.isOfType(position, blocks.types.DOGE.number)) {
        alert('such indestructible');
        alert('wow');
        return false;
      }

      return coding.confirm(position, consts.confirmableFunctions.EDIT);
    }

    voxelEngine.onFire((target, state) => {
      var placePosition = highlight.getPlacePosition();
      var editPosition = highlight.getEditPosition();

      if (placePosition && canPlace(placePosition)) {
        placeBlock(placePosition);
      } else {
        if (editPosition && canEdit(editPosition)) {
          if(state.fire === 1) {
            removeBlock(editPosition);
          } else {
            codeBlock(editPosition);
          }
        }
      }
    });
  }
};
