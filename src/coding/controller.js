var github = require('./github');
var expandGists = require('./expandGists');

var gists = {};
var dirty = false;

module.exports = {
  getGistIds: function() {
    return gists;
  },
  isDirty: function() {
    return dirty;
  },
  getAllCode: function(token) {
    if(token) {
      var getGist = function(gistId) {
        return github.getGist(gistId, token);
      };
      return expandGists(gists, getGist);
    } else {
      return Promise.resolve(gists);
    }
  },
  onCodeChanged: function(position, code, token, broadcast) {
    var updateGithub = function() {
      if(gists[position]) {
        return github.updateGist(gists[position], code, token); // TODO fork if this is not mine
      } else {
        return github.createGist(code, token).then(function(response) {
          gists[position] = response.id;
          dirty = true;
        });
      }
    };

    return updateGithub().then(function() {
      var codeObj = {
        id: gists[position],
        code: code
      };
      broadcast(position, codeObj);
      return codeObj;
    });
  },
  onCodeRemoved: function(position, broadcast) {
    delete gists[position];
    broadcast(position);
    dirty = true;
  }
};
