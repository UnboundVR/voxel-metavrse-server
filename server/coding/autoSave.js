var storage = require('./store');

module.exports = {
  setDirty: function(dirty) {
    this.dirty = dirty;
  },
  init: function(interval, getGists) {
    var saveGists = function() {
      if(this.dirty) {
        storage.saveGists(getGists());
        this.setDirty(false);
      }
    };
    
    setInterval(saveGists.bind(this), interval);
  }
};
