import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';

export default {
  init: function() {
    Vue.component('chat-component', ChatComponent);
  }
};
