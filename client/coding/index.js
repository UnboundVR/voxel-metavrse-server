var client = require('./codingClient');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var editCode = require('./editCode');

module.exports = {
  init: function(socket) {
    client.init(socket).then(function() {
      client.getBlocksWithGists().forEach(function(block) {
        block.script.then(function(response) {
          executor.create(block.position, response.code);
          voxelEngine.setBlock(block.position, 2);
        }, function(error) {
          console.log('cannot load script in ' + block.position.join('|') + ' from github');
          voxelEngine.setBlock(block.position, 2);
        });
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
