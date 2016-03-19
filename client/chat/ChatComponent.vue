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
import pointerLock from './../pointerLock.js';
import io from 'socket.io-client';
import service from './service';

var socket;
var username = auth.getName() || 'anonymous';

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
    addMessage: function(message) {
      this.messageList.push(message);
    },
    enterHandler: function(e) {
      if (e.keyCode !== 13) return;

      var el = document.getElementById('cmd');
      if (document.activeElement !== el) {
        pointerLock.release();
        el.focus();
      }
    },
    sendNewMessage: function() {
      var msg = { date: Date.now(), user: username, text: this.newMessage };
      socket.emit('message', msg);
      this.addMessage(msg);
      this.newMessage = '';
    },
    init: function(socketParam) {
      let self = this;
      socket.on('message', function(message) {
        self.addMessage(message);
      });
    }
  },
  created: function() {
    socket = io.connect(location.host + '/chat');
    this.init();
    this.enable();
  },
};
</script>

<style>
#messages li {
  color: #FF0000;
}
</style>
