var files = require('./fileStorage');
var gistsPath = 'gists.json';

module.exports = {
  saveGists: function(gists) {
    return files.save(gistsPath, gists);
  },
  loadGists: function() {
    return files.load(gistsPath);
  }
};
