import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';
import pointerLock from './../pointerLock.js';

module.exports = {
  init: function() {
    Vue.component('chat-component', ChatComponent);
  },
  enable: function() {
    window.addEventListener('keyup', this.enterHandler);
  },
  disable: function() {
    window.removeEventListener('keyup', this.enterHandler);
  },
  enterHandler: function(e) {
    if (e.keyCode !== 13) return;

    var el = document.getElementById('cmd');
    if (document.activeElement !== el) {
      pointerLock.release();
      el.focus();
    }
  },
};
