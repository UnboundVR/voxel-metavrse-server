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
import auth from './../auth/';
import service from './service';
import events from '../events';
import pointerLock from '../pointerLock';
import consts from '../../shared/constants';

export default {
  name: 'ChatComponent',
  data() {
    return {
      messageList: [],
      newMessage: ''
    };
  },
  methods: {
    enableEnterHandler: function() {
      window.addEventListener('keyup', this.enterHandler);
    },
    disableEnterHandler: function() {
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
    }
  },
  ready() {
    service.init();
    service.on('message', this.addMessage);
    this.enableEnterHandler();

    events.on(consts.events.FULLSCREEN_WINDOW_OPEN, this.disableEnterHandler);
    events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, this.enableEnterHandler);
  }
};
</script>

<style>
#chat {
  padding: 10px;
  height: 200px;
  width: 25%;
  position: absolute;
  bottom: 50px;
  left: 0;
}

  #chat #messages {
    max-height: 153px;
    overflow: auto;
  }

    #chat #messages li {
      color: #FF0000;
    }

  #cmdbox {
    position: absolute;
    bottom: 0;
  }

  #chat input {
    box-shadow: none;
    padding: 0px 10px;
    margin: 0;
    background: none;
    border: none;
    border-radius: 0;
  }

  #chat input, input:focus {
    /* outline: none; */
  }
</style>
