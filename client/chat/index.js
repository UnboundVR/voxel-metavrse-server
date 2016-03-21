var Vue = require('vue');
var ChatComponent = require('./ChatComponent.vue');

module.exports = {
  init: function() {
    Vue.component('chat-component', ChatComponent);
  }
};
