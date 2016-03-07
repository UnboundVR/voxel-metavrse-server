var controller = require('./controller');
var consts = require('../../shared/constants');

module.exports = function(io) {
  controller.init().then(function() {
    setInterval(function() {
      controller.storeCode().catch(function(err) {
        console.log('Error updating code', err);
      });
    }, consts.coding.AUTO_SAVE_INTERVAL);

    io.on('connection', function(socket) {
      socket.on('requestAllCode', function(token, callback) {
        controller.getAllCode(token).then(function(allCode) {
          callback(null, allCode);
        }).catch(function(err) {
          callback(err);
        });
      });

      socket.on('codeChanged', function(position, code, token, callback) {
        var broadcast = function(position, codeObj) {
          socket.broadcast.emit('codeChanged', position, codeObj);
        };

        controller.onCodeChanged(position, code, token, broadcast).then(function(codeObj) {
          callback(null, codeObj);
        }).catch(function(err) {
          callback(err);
        });
      });

      socket.on('codeRemoved', function(position) {
        var broadcast = function(position) {
          socket.broadcast.emit('codeRemoved', position);
        };

        controller.onCodeRemoved(position, broadcast);
      });
    });
  }).catch(function(err) {
    console.log('Cannot initialize coding.', err);
  });
};
