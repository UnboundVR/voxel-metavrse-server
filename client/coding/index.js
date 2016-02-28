var coding = require('./coding');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var editCode = require('./editCode');

module.exports = {
  init: function(socket) {
    coding.init(socket).then(function() {
      coding.getBlocksWithGists().forEach(function(block) {
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
    if(coding.getGistId(position)) {
      coding.removeGist(position);
      executor.remove(position);
    }
  }
};
