var blockTypes = require('./blockTypes');

var blocksDict = {};
blockTypes.forEach(function(blockType) {
  blocksDict[blockType.name.toUpperCase()] = blockType;
});

var count = 1;
blockTypes.forEach(function(blockType) {
  blockType.number = count++;
});

module.exports = {
  types: blocksDict,
  getMaterials: function() {
    return Object.keys(blockTypes).map(function(blockType) {
      return blockTypes[blockType].material;
    });
  },
  getToolbarItems: function() {
    return blockTypes.filter(function(blockType) {
      return blockType.visibleInToolbar;
    });
  }
};
