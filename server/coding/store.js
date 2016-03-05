var files = require('../fileStorage')('coding');
var gistsPath = 'gists.json';

module.exports = {
  saveGists: function(gists) {
    return files.save(gistsPath, gists);
  },
  loadGists: function() {
    return files.load(gistsPath);
  }
};
