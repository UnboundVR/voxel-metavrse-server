import client from './voxelClient';
import auth from './auth';
import coding from './coding';
import blockPlacement from './blockPlacement';
import playerSync from './playerSync';
import voxelEngine from './voxelEngine';
import chat from './chat';
import toolbar from './toolbar';
import ide from './ide';
import Vue from 'vue';
import events from './events';
import consts from '../shared/constants';

function initVue() {
  var vue = new Vue({
    el: 'body',
    data: {
      showUI: true
    }
  });

  events.on(consts.events.FULLSCREEN_WINDOW_OPEN, () => vue.showUI = false);
  events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, () => vue.showUI = true);
}

export default function() {
  auth.init().then(function() {
    client.init().then(function() {
      voxelEngine.init(client.engine);

      Promise.all([
        blockPlacement.init(),
        playerSync.init(),
        chat.init(),
        coding.init(),
        toolbar.init(),
        ide.init()
      ]).then(function() {
        try {
          voxelEngine.appendToContainer();
        } catch(err) {
          console.log('Browser not capable');
        }

        initVue();
      }).catch(function(err) {
        console.log('Error initializing some modules', err);
        throw err;
      });
    });
  });
}
