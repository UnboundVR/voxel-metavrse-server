<template>
  <div id="chat">
    <ul id="messages">
      <li v-for='message in messageList'>{{ message.user }} - {{ message.date }} - {{ message.text }}</li>
    </ul>
    <div id="cmdbox">
      <input
        type="text"
        id="cmd"
        v-model="newMessage"
        placeholder="Press <enter> to chat"
        @keyup.enter="sendNewMessage"
        v-el:message-input />
      <br/>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import auth from './../auth/';
import service from './service';
import events from '../eventListener.js';
import pointerLock from '../pointerLock.js';
import consts from '../../shared/constants';

export default {
  name: 'ChatComponent',
  data() {
    return {
      messageList: [],
      newMessage: '',
    };
  },
  methods: {
    enable: function() {
      window.addEventListener('keyup', this.enterHandler);
    },
    disable: function() {
      window.removeEventListener('keyup', this.enterHandler);
    },
    enterHandler: function(e) {
      if (e.keyCode !== 13) return;

      var el = this.$els.messageInput;
      if (document.activeElement !== el) {
        pointerLock.release();
        el.focus();
      }
    },
    sendNewMessage() {
      var username = auth.getName() || 'anonymous';
      var message = { date: Date.now(), user: username, text: this.newMessage };
      this.addMessage(message);
      service.sendMessage(message);
      this.newMessage = '';
      pointerLock.request();
      this.$els.messageInput.blur();
      //console.log(pointerLock.available()); // TODO enhance chat ux
    },
    addMessage(message) {
      this.messageList.push(message);
    },
  },
  ready() {
    let self = this;

    service.init(this.addMessage)
      .then(function() {
        events.emit('chatReady');
      });

    events.on('enableChatEnterHandler', function() {
      self.enable();
    });

    events.on('disableChatEnterHandler', function() {
      self.disable();
    });

    events.on(consts.events.FULLSCREEN_WINDOW_OPEN, this.disable);
    events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, this.enable);
  },
};
</script>

<style>
#messages li {
  color: #FF0000;
}
</style>
