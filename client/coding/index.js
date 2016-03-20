var client = require('./codingClient');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var editCode = require('./editCode');

module.exports = {
  init: function() {
    client.init().then(function() {
      client.getBlocksWithCode().forEach(function(block) {
        executor.create(block.position, block.codeObj.code);
        voxelEngine.setBlock(block.position, 2);
      });
    });
  },
  editCode: editCode,
  confirm: executor.confirm,
  removeCode: function(position) {
    if(client.hasCode(position)) {
      client.removeCode(position);
      executor.remove(position);
    }
  }
};
