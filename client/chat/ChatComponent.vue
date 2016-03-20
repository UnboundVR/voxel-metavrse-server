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

export default {
  name: 'ChatComponent',
  data() {
    return {
      messageList: service.messageList,
      newMessage: '',
    };
  },
  methods: {
    sendNewMessage() {
      var username = auth.getName() || 'anonymous';
      var message = { date: Date.now(), user: username, text: this.newMessage };
      service.sendMessage(message);
      this.newMessage = '';
    }
  },
  created() {
    service.init();
  },
};
</script>

<style>
#messages li {
  color: #FF0000;
}
</style>
