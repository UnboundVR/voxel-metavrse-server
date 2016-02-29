var storage = require('../../services/store/coding');
var github = require('../../services/github');
var extend = require('extend');

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
      gists = res;
      setInterval(saveGists, 1000); // 1s
    });
  },
  getAllCode: function(token) {
    var promises = [];
    Object.keys(gists).forEach(function(position) {
      promises.push(github.getGist(gists[position], token).then(function(gist) {
        return extend(gist, {position: position});
      }));
    });

    var result = {};
    return Promise.all(promises).then(function(codeObjs) {
      codeObjs.forEach(function(codeObj) {
        result[codeObj.position] = {
          id: codeObj.id,
          code: codeObj.code
        };
      });

      return result;
    });
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
