import toolbar from 'toolbar';
import blocks from '../../shared/blocks';

var toolbarItems = blocks.getToolbarItems();
var currentMaterial = toolbarItems[0].number;

export default {
  init() {
    var selector = toolbar();
    selector.on('select', function(item) {
      currentMaterial = parseInt(item);
    });
  },
  getSelected() {
    return currentMaterial;
  },
  getToolbarItems() {
    return toolbarItems;
  }
};
