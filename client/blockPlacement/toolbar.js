var toolbar = require('toolbar');
var blocks = require('../../shared/blocks');
var Vue = require('vue');

var toolbarItems = blocks.getToolbarItems();
var currentMaterial = toolbarItems[0].number;

module.exports = {
  init: function() {
    var vm = new Vue({
      el: '#toolbar',
      data: {
        items: toolbarItems
      }
    });

    var selector = toolbar();
    selector.on('select', function(item) {
      var tabItems = document.getElementsByClassName('tab-label');
      for(var i = 0; i < tabItems.length; i++) {
        var tabItem = tabItems[i];
        if(tabItem.innerText === item) {
          currentMaterial = parseInt(tabItem.attributes['data-id'].value);
          break;
        }
      }
    });
  },
  getSelected: function() {
    return currentMaterial;
  }
};
