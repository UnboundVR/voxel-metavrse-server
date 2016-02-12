var github = require('./github');
var executor = require('./scriptExecutor');

var gistIds;

module.exports = {
  init: function(socket) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.socket = socket;
      socket.emit('requestGists', function(response) {
        gistIds = response;
        resolve();
      });
      socket.on('codeChanged', function(position, gistId) {
        gistIds[position] = gistId;
        github.getGist(gistId).then(function(gist) {
          executor.update(position, gist.code);
        });
      });
      socket.on('codeRemoved', function(position, gistId) {
        delete gistIds[position];
        executor.remove(position);
      });
    });
  },
  getBlocksWithGists: function() {
    return Object.keys(gistIds).map(function(key) {
      return {
        position: key.split(','),
        script: github.getGist(gistIds[key])
      };
    });
  },
  getGistId: function(position) {
    return gistIds[position];
  },
  storeGistId: function(position, gistId) {
    gistIds[position] = gistId;
    this.socket.emit('codeChanged', position, gistId);
  },
  removeGist: function(position) {
    delete gistIds[position];
    this.socket.emit('codeRemoved', position);
  }
};
