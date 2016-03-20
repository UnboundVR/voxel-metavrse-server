import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';
import events from '../eventListener.js';

module.exports = {
  init: function() {
    Vue.component('chat-component', ChatComponent);
    
    events.on('chatReady', function() {
      events.emit('enableChatEnterHandler');
    });
  },
};
