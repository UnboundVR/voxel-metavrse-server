var blockTypes = require('./blockTypes');

var count = 1;
blockTypes.forEach(function(blockType) {
  blockType.number = count++;
});

module.exports = {
  getMaterials: function() {
    return Object.keys(blockTypes).map(function(blockType) {
      return blockTypes[blockType].material;
    });
  }
};
