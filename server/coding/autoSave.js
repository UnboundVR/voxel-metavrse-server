var storage = require('./store');

var saveGists = function() {
  if(this.dirty) {
    storage.saveGists(gists);
    this.setDirty(false);
  }
};

module.exports = {
  setDirty: function(dirty) {
    this.dirty = dirty;
  },
  init: function(interval) {
    setInterval(saveGists.bind(this), interval);
  }
};
