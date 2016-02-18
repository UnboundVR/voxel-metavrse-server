var highlight = require('./blockHighlight');
var executor = require('./scriptExecutor');
var editCode = require('./editCode');
var blocks = require('../shared/blocks');
var coding = require('./coding');
var toolbar = require('./blocksToolbar');
var engineAccessor = require('./engineAccessor');

module.exports = function(client) {
  var engine = engineAccessor.engine;

  highlight.init();
  toolbar.init();

  function getAdjacent(pos) {
    var adj = [];

    adj.push([pos[0] + 1, pos[1], pos[2]]);
    adj.push([pos[0], pos[1] + 1, pos[2]]);
    adj.push([pos[0], pos[1], pos[2] + 1]);
    adj.push([pos[0] - 1, pos[1], pos[2]]);
    adj.push([pos[0], pos[1] - 1, pos[2]]);
    adj.push([pos[0], pos[1], pos[2] - 1]);

    return adj;
  }

  function adjacentToTrollBlock(position) {
    var adj = getAdjacent(position);

    for(var i = 0; i < adj.length; i++) {
      var pos = adj[i];
      if(engine.getBlock(pos) == blocks.types.TROLL.number) {
        return true;
      }
    }

    return false;
  }

  function placeBlock(position) {
    engine.createBlock(position, toolbar.getSelected());
    client.socket.emit('set', position, toolbar.getSelected());
  }

  function codeBlock(position) {
    editCode(position).then(function() {
      var codeBlockNumber = blocks.types.CODE.number;
      engine.setBlock(position, codeBlockNumber);
      client.socket.emit('set', position, codeBlockNumber);
    });
  }

  function removeBlock(position) {
    if(coding.getGistId(position)) {
      coding.removeGist(position);
      executor.remove(position);
    }

    engine.setBlock(position, 0);
    client.socket.emit('set', position, 0);
  }

  function canPlace(position) {
    if(adjacentToTrollBlock(position)) {
      alert('problem?');
      return false;
    }

    var adjPositions = getAdjacent(position);
    var canPlace = true;

    adjPositions.forEach(function(adjPos) {
      canPlace = canPlace && executor.confirm(adjPos, 'PlaceAdjacent'); // TODO use constants
    });

    return canPlace;
  }

  function canEdit(position) {
    if(engine.getBlock(position) == blocks.types.TILE.number) {
      return false;
    }

    if(engine.getBlock(position) == blocks.types.TROLL.number) {
      alert('the troll must go on');
      return false;
    }

    if(engine.getBlock(position) == blocks.types.DOGE.number) {
      alert('such indestructible');
      alert('wow');
      return false;
    }

    return executor.confirm(position, 'Edit'); // TODO use constants
  }

  engine.on('fire', function (target, state) {
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
