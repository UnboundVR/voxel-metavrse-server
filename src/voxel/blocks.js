import blockTypes from './blockTypes';

var count = 1;
blockTypes.forEach(blockType => {
  blockType.number = count++;
});

export default {
  getMaterials() {
    return Object.keys(blockTypes).map(blockType => {
      return blockTypes[blockType].material;
    });
  }
};
