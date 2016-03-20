var client = require('./voxelClient');
var auth = require('./auth');
var coding = require('./coding');
var blockPlacement = require('./blockPlacement');
var playerSync = require('./playerSync');
var voxelEngine = require('./voxelEngine');
var chat = require('./chat');
var consts = require('../shared/constants');
var io = require('socket.io-client');
var Vue = require('vue');

function initVue() {
  new Vue({
    el: 'body',
  });
}

module.exports = function() {
  auth.init().then(function() {
    client.init().then(function() {
      voxelEngine.init(client.engine);

      Promise.all([blockPlacement.init(), playerSync.init(), chat.init(), coding.init()]).then(function() {
        try {
          voxelEngine.appendToContainer();
        } catch(err) {
          console.log('Browser not capable');
        }

        initVue();
      }).catch(function(err) {
        console.log('Error initializing some modules', err);
      });
    });
  });
};
