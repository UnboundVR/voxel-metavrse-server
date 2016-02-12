var highlight = require('voxel-highlight');
var executor = require('./scriptExecutor');
var editCode = require('./editCode');
var toolbar = require('toolbar');
var blocks = require('../shared/blocks');
var Vue = require('vue');
var gists = require('./gists');

module.exports = function(game, client) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase;
  var hl = game.highlighter = highlight(game, { color: 0xff0000 });

  hl.on('highlight', function (voxelPos) {
    blockPosErase = voxelPos;
  });

  hl.on('remove', function (voxelPos) {
    blockPosErase = null;
  });

  hl.on('highlight-adjacent', function (voxelPos) {
    blockPosPlace = voxelPos;
  });

  hl.on('remove-adjacent', function (voxelPos) {
     blockPosPlace = null;
  });

  var toolbarItems = blocks.getToolbarItems();
  var currentMaterial = toolbarItems[0].number;

  var toolbarVM = new Vue({
    el: '#toolbar',
    data: {
      items: toolbarItems
    }
  });

  var selector = toolbar();
  selector.on('select', function(item) {
    var tabItems = document.getElementsByClassName('tab-label');
    for(var i = 0; i < tabItems.length; i++) {
      var tabItem = tabItems[i];
      if(tabItem.innerText === item) {
        currentMaterial = parseInt(tabItem.attributes['data-id'].value);
        break;
      }
    }
  });

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
      if(game.getBlock(pos) == blocks.types.TROLL.number) {
        return true;
      }
    }

    return false;
  }

  game.on('fire', function (target, state) {
    var position = blockPosPlace;
    if (position) {
      if(adjacentToTrollBlock(position)) {
        alert('problem?');
        return;
      }
      game.createBlock(position, currentMaterial);
      client.socket.emit('set', position, currentMaterial);
    } else {
      position = blockPosErase;
      if (position) {
        if(game.getBlock(position) == blocks.types.TILE.number) {
          return;
        }

        if(game.getBlock(position) == blocks.types.TROLL.number) {
          alert('beware of the troll');
          return;
        }

        if(game.getBlock(position) == blocks.types.DOGE.number) {
          alert('such indestructible');
          alert('wow');
          return;
        }

        if(state.fire === 1) {
          gists.removeGist(position);
          executor.remove(position);
          game.setBlock(position, 0);
          client.socket.emit('set', position, 0);
        } else {
          editCode(position).then(function() {
            var codeBlockNumber = blocks.types.CODE.number;
            game.setBlock(position, codeBlockNumber);
            client.socket.emit('set', position, codeBlockNumber);
          });
        }
      }
    }
  });
};
