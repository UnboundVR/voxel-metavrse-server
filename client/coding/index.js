var coding = require('./coding');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');

module.exports = function(socket) {
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
};
