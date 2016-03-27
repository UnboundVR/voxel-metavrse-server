import toolbar from 'toolbar';
import blocks from '../blocks';

var toolbarItems;
var currentMaterial;

export default {
  init() {
    toolbarItems = blocks.getToolbarItems();
    currentMaterial = toolbarItems[0].number;
  },
  hookSelection() {
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
