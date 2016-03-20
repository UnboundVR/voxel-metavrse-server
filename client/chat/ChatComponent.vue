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
        @keyup.enter="sendNewMessage" />
      <br/>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import auth from './../auth/';
import service from './service';
import events from '../events';
import consts from '../../shared/constants';
import pointerLock from '../pointerLock';

export default {
  name: 'ChatComponent',
  data() {
    return {
      messageList: [],
      newMessage: '',
    };
  },
  methods: {
    sendNewMessage() {
      var username = auth.getName() || 'anonymous';
      var message = { date: Date.now(), user: username, text: this.newMessage };
      this.addMessage(message);
      service.sendMessage(message);
      this.newMessage = '';
    },
    addMessage(message) {
      this.messageList.push(message);
    },
    enable() {
      window.addEventListener('keyup', this.enterHandler);
    },
    disable() {
      window.removeEventListener('keyup', this.enterHandler);
    },
    enterHandler(e) {
      if (e.keyCode !== 13) {
        return;
      }

      var el = document.getElementById('cmd');
      if (document.activeElement !== el) {
        pointerLock.release();
        el.focus();
      }
    }
  },
  created() {
    service.init(this.addMessage);
    this.enable();

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
