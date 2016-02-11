var highlight = require('voxel-highlight');
var executor = require('./scriptExecutor');
var editCode = require('./editCode');
var toolbar = require('toolbar');

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

  var currentMaterial = 3;

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

  game.on('fire', function (target, state) {
    var position = blockPosPlace;
    if (position) {
      game.createBlock(position, currentMaterial);
      client.socket.emit('set', position, currentMaterial);
    } else {
      position = blockPosErase;
      if (position && game.getBlock(position) != 1) {
        if(game.getBlock(position) == 4) {
          alert('such indestructible');
          alert('wow');
          return;
        }
        if(state.fire === 1) {
          executor.remove(position);
          game.setBlock(position, 0);
          client.socket.emit('set', position, 0);
        } else {
          editCode(position).then(function() {
            game.setBlock(position, 2);
            client.socket.emit('set', position, 0);
          });
        }
      }
    }
  });
};
