var storage = require('./store');
var github = require('./github');
var expandGists = require('../../shared/coding/expandGists');

var gists;
var dirty = false;

function saveGists() {
  if(dirty) {
    storage.saveGists(gists);
    dirty = false;
  }
}

module.exports = {
  init: function() {
    return storage.loadGists().then(function(res) {
      if(res) {
        gists = res;
      } else {
        gists = {};
      }
      setInterval(saveGists, 1000); // 1s
    });
  },
  getAllCode: function(token) {
    if(token) {
      return expandGists(gists, function(gistId) {
        return github.getGist(gistId, token);
      });
    } else {
      return Promise.resolve(gists);
    }
  },
  onCodeChanged: function(position, code, token, broadcast) {
    if(gists[position]) {
      return github.updateGist(gists[position], code, token).then(function() { // TODO if it's not mine, fork it and return new one
        var codeObj = {
          id: gists[position],
          code: code
        };
        broadcast(position, codeObj);
        return codeObj;
      });
    } else {
      return github.createGist(code, token).then(function(response) {
        gists[position] = response.id;
        dirty = true;
        var codeObj = {
          id: gists[position],
          code: code
        };
        broadcast(position, codeObj);
        return codeObj;
      });
    }
  },
  onCodeRemoved: function(position, broadcast) {
    delete gists[position];
    broadcast(position);
    dirty = true;
  }
};
