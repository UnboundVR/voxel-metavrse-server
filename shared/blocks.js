var types = require('./blockTypes');

module.exports = {
  getMaterials: function() {
    return Object.keys(types).map(function(type) {
      return types[type].material;
    });
  }
};
