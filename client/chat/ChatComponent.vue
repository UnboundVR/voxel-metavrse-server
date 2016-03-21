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

      if (document.activeElement !== this.$els.messageInput) {
        pointerLock.release();
        this.$els.messageInput.focus();
      }
    },
    sendNewMessage() {
      let el = this.$els.messageInput;

      if (document.activeElement === el) {
        if (el.value === '') {
          el.blur();
          pointerLock.request();
        } else {
          var username = auth.getName() || 'Guest';
          var message = { date: Date.now(), user: username, text: this.newMessage };
          this.addMessage(message);
          service.sendMessage(message);
          this.newMessage = ''; // TODO: See why the hell this doesn't update the model and we have to use --v
          el.value = '';
          el.blur(); // TODO: This doesn't css-blur the input, the cursor and the border persists.
          pointerLock.request();
        }
      }
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
#cmd {
  color: #FFFFFF;
}

#messages li {
  color: #FF0000;
}
</style>
