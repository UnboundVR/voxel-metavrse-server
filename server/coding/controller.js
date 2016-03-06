var storage = require('./store');
var github = require('./github');
var expandGists = require('../../shared/coding/expandGists');
var autoSave = require('./autoSave');
var consts = require('../../shared/constants');

var gists;

module.exports = {
  init: function() {
    return storage.loadGists().then(function(res) {
      if(res) {
        gists = res;
      } else {
        gists = {};
      }
      autoSave.init(consts.coding.AUTO_SAVE_INTERVAL, function() {
        return gists;
      });
    });
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
          autoSave.setDirty(true);
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
    autoSave.setDirty(true);
  }
};
