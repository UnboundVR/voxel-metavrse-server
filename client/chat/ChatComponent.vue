<template>
  <div id="chat-component" v-bind:class="[ this.css.chat.isChatFocused ? this.css.chat.chatFocused : this.css.chat.chatNotFocused ]">
    <ul id="chat-component-message-list">
      <li class="chat-component-message-list-message" v-for='message in messageList'>[{{ message.date }}] [{{ message.user }}]: {{ message.text }}</li>
    </ul>
    <div id="chat-component-messagebox-wrapper">
      <input
        type="text"
        id="chat-component-messagebox-input"
        v-model="newMessage"
        placeholder="Press <enter> to chat"
        @keyup.enter="sendNewMessage"
        v-el:message-input />
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
      newMessage: '',
      css: {
        chat: {
          isChatFocused: false,
          chatNotFocused: 'chat-component-not-focus',
          chatFocused: 'chat-component-focus',
        }
      }
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

      if (document.activeElement !== this.$els.messageInput) {
        pointerLock.release();
        this.$els.messageInput.focus();
        this.css.isChatFocused = true;
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
          this.css.isChatFocused = false;
          pointerLock.request();
        }
      }
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
  },
};
</script>

<style lang="scss">

#chat-component {
  padding: 2px;
  height: 200px;
  width: 30%;
  position: absolute;
  bottom: 40px;
  left: 10px;

  #chat-component-message-list {
    max-height: 153px;
    overflow: auto;

    .chat-component-message-list-message {
      color: #FF0000;
    }
  }

  #chat-component-messagebox-wrapper {
    height: 30px;
    width: 100%;
    position: absolute;
    bottom: 0;

    #chat-component-messagebox-input {
      height: 20px;
      box-shadow: none;
      padding: 0px 10px;
      margin: 0;
      background: none;
      border: none;
      border-radius: 0;
      color: #FFFFFF;

      &:focus {
        outline: none;
      }
    }
  }
}

.chat-component-not-focus {
  background-color: rgba(20, 20, 20, 0.2);
}

.chat-component-focus {
  background-color: rgba(20, 20, 20, 0.6);
}
</style>
