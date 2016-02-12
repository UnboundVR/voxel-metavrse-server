var types = require('./blockTypes');

module.exports = {
  getMaterials: function() {
    return Object.keys(types).map(function(type) {
      return types[type].material;
    });
  },
  getNumber: function(blockInfo) {
    var count = 1;
    for(var key in types) {
      if(types[key] === blockInfo) {
        return count;
      }
      count++;
    }
  }
};
