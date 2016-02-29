var github = require('./github');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var blocks = require('../../shared/blocks');

var blocksWithCode;

module.exports = {
  init: function(socket) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.socket = socket;
      socket.emit('requestAllCode', function(response) {
        blocksWithCode = response;
        resolve();
      });
      socket.on('codeChanged', function(position, gistId) {
        blocksWithCode[position] = gistId;
        github.getGist(gistId).then(function(gist) {
          executor.update(position, gist.code);
          voxelEngine.setBlock(position, blocks.types.CODE.number);
        });
      });
      socket.on('codeRemoved', function(position) {
        delete blocksWithCode[position];
        executor.remove(position);
      });
    });
  },
  getBlocksWithGists: function() {
    return Object.keys(blocksWithCode).map(function(key) {
      return {
        position: key.split(','),
        script: github.getGist(blocksWithCode[key])
      };
    });
  },
  getGistId: function(position) {
    return blocksWithCode[position];
  },
  hasCode: function(position) {
    return !!blocksWithCode[position];
  },
  storeGistId: function(position, gistId) {
    blocksWithCode[position] = gistId;
    this.socket.emit('codeChanged', position, gistId);
  },
  removeCode: function(position) {
    delete blocksWithCode[position];
    this.socket.emit('codeRemoved', position);
  }
};
