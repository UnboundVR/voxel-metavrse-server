var highlight = require('./blockHighlight');
var executor = require('../coding/scriptExecutor');
var editCode = require('../coding/editCode');
var blocks = require('../../shared/blocks');
var coding = require('../coding/coding');
var toolbar = require('./toolbar');
var voxelEngine = require('../voxelEngine');
var consts = require('../../shared/constants');
var getAdjacent = require('./getAdjacentPositions');

module.exports = function(socket) {
  highlight.init();
  toolbar.init();

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
    socket.emit('set', position, toolbar.getSelected());
  }

  function codeBlock(position) {
    editCode(position).then(function() {
      var codeBlockNumber = blocks.types.CODE.number;
      voxelEngine.setBlock(position, codeBlockNumber);
      socket.emit('set', position, codeBlockNumber);
    });
  }

  function removeBlock(position) {
    if(coding.getGistId(position)) {
      coding.removeGist(position);
      executor.remove(position);
    }

    voxelEngine.setBlock(position, 0);
    socket.emit('set', position, 0);
  }

  function canPlace(position) {
    if(adjacentToTrollBlock(position)) {
      alert('problem?');
      return false;
    }

    var adjPositions = getAdjacent(position);
    var canPlace = true;

    adjPositions.forEach(function(adjPos) {
      canPlace = canPlace && executor.confirm(adjPos, consts.confirmableFunctions.PLACE_ADJACENT);
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

    return executor.confirm(position, consts.confirmableFunctions.EDIT);
  }

  voxelEngine.onFire(function (target, state) {
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
};
