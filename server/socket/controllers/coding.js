var storage = require('../../services/store/coding');

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
  getGists: function() {
    return gists;
  },
  onCodeChanged: function(position, gistId, broadcast) {
    gists[position] = gistId;
    broadcast(position, gistId);
    dirty = true;
  },
  onCodeRemoved: function(position, broadcast) {
    delete gists[position];
    broadcast(position);
    dirty = true;
  }
};
