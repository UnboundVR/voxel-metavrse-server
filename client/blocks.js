// TODO store this in server, not client

var github = require('./github');

var gistIds = localStorage.getObject('gistIds');
if(!gistIds) {
  gistIds = {};
  localStorage.setObject('gistIds', gistIds);
}

module.exports = {
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
    localStorage.setObject('gistIds', gistIds);
  }
};
