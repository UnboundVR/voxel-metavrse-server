var github = require('./github');

var gistIds;

module.exports = {
  init: function(socket) {
    var self = this;
    this.socket = socket;
    socket.on('allGists', function(response) {
      gistIds = response;
      self.getBlocksWithGistsCallback(Object.keys(gistIds).map(function(key) {
        return {
          position: key.split(','),
          script: github.getGist(gistIds[key])
        };
      }));
    });
    socket.on('codeChanged', function(position, gistId) {
      // TODO handle
    });
  },
  getBlocksWithGists: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getBlocksWithGistsCallback = resolve;
    });
  },
  getGistId: function(position) {
    return gistIds[position];
  },
  storeGistId: function(position, gistId) {
    gistIds[position] = gistId;
    this.socket.emit('codeChanged', position, gistId);
  }
};
