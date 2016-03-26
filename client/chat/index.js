import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';

export default {
  init() {
    Vue.component('chat-component', ChatComponent);
  }
};
