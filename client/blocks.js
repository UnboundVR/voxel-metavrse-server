var blockTypes;
var blocksDict = {};

module.exports = {
  init(types) {
    blockTypes = types;
    blockTypes.forEach(function(blockType) {
      blocksDict[blockType.name.toUpperCase()] = blockType;
    });

    var count = 1;
    blockTypes.forEach(function(blockType) {
      blockType.number = count++;
    });
  },
  types: blocksDict,
  getToolbarItems() {
    return blockTypes.filter(function(blockType) {
      return blockType.visibleInToolbar;
    });
  },
  getBlockInfo(number) {
    return blockTypes[number + 1];
  }
};
