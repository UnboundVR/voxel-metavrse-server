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
        v-el:message-input />
    </div>
  </div>
</template>

<script>
import auth from './../auth/';
import service from './service';
import events from '../events';
import pointerLock from '../pointerLock';
import consts from '../constants';

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
          chatFocused: 'chat-component-focus'
        }
      }
    };
  },
  methods: {
    enableEnterHandler() {
      window.addEventListener('keyup', this.enterHandler);
    },
    disableEnterHandler() {
      window.removeEventListener('keyup', this.enterHandler);
    },
    enterHandler(e) {
      if (e.keyCode !== 13) return;

      var el = this.$els.messageInput;
      if (document.activeElement === this.$parent.$el || document.activeElement === 'null' || document.activeElement === undefined) {
        pointerLock.release();
        el.focus();
        this.css.chat.isChatFocused = true;
      } else if (document.activeElement === el) {
        if (this.newMessage === '' || this.newMessage === null || el.value === '') {
          el.blur();
          this.css.chat.isChatFocused = false;
          pointerLock.request();
        } else if (this.newMessage !== '' || el.value !== '') {
          var username = auth.getName() || 'Guest';
          var message = { date: Date.now(), user: username, text: this.newMessage };
          this.addMessage(message);
          service.sendMessage(message);
          this.newMessage = ''; // TODO: See why the hell this doesn't update the model and we have to use this thing below --v
          el.value = '';
          this.css.chat.isChatFocused = false;
          el.blur();
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
  }
};
</script>

<style lang="scss">

#chat-component {
  padding: 10px;
  height: 200px;
  width: 30%;
  position: absolute;
  bottom: 40px;
  left: 10px;

  #chat-component-message-list {
    max-height: 153px;
    overflow: auto;

    .chat-component-message-list-message {
      color: #FFFFFF;
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
  border: 1px solid rgba(240, 240, 240, 0.03);
}

.chat-component-focus {
  background-color: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(240, 240, 240, 0.1);
}
</style>
