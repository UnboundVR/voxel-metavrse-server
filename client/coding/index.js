var coding = require('./coding');
var executor = require('./scriptExecutor');
var engineAccessor = require('../engineAccessor');

module.exports = function(client) {
  var engine = engineAccessor.engine;

  coding.init(client.socket).then(function() {
    coding.getBlocksWithGists().forEach(function(block) {
      block.script.then(function(response) {
        executor.create(block.position, response.code);
        engine.setBlock(block.position, 2);
      }, function(error) {
        console.log('cannot load script in ' + block.position.join('|') + ' from github');
        engine.setBlock(block.position, 2);
      });
    });
  });
};
