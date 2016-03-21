var toolbar = require('toolbar');
var blocks = require('../../shared/blocks');
var Vue = require('vue');

var toolbarItems = blocks.getToolbarItems();
var currentMaterial = toolbarItems[0].number;

module.exports = {
  init: function() {
    new Vue({
      el: '#toolbar',
      data: {
        items: toolbarItems
      }
    });

    var selector = toolbar();
    selector.on('select', function(item) {
      currentMaterial = parseInt(item);
    });
  },
  getSelected: function() {
    return currentMaterial;
  }
};
