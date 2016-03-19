import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';

module.exports = {
  init: function() {
    Vue.component('chat-component', ChatComponent);
  }
};
