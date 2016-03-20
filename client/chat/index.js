import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';
import pointerLock from './../pointerLock.js';

module.exports = {
  init: function() {
    Vue.component('chat-component', ChatComponent);
  },
};
