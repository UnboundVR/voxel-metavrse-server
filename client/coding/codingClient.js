var github = require('./github');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var blocks = require('../../shared/blocks');
var auth = require('../auth');

var blocksWithCode;

module.exports = {
  init: function(socket) {
    var self = this;
    this.socket = socket;
    return new Promise(function(resolve, reject) {
      socket.emit('requestAllCode', auth.getAccessToken(), function(response) {
        if(auth.isLogged()) {
          blocksWithCode = response;
          resolve();
        } else {
          // TODO use local github api to fetch all code
          throw 'auth error';
        }
      });
      socket.on('codeChanged', function(position, codeObj) {
        if(auth.isLogged()) {
          blocksWithCode[position] = codeObj;
        } else {
          // TODO use local github api to fetch code
          throw 'auth error';
        }
        executor.update(position, code);
        voxelEngine.setBlock(position, blocks.types.CODE.number);
      });
      socket.on('codeRemoved', function(position) {
        delete blocksWithCode[position];
        executor.remove(position);
      });
    });
  },
  getBlocksWithCode: function() {
    var result = [];
    Object.keys(blocksWithCode).forEach(function(pos) {
      result.push({
        position: pos.split(','),
        codeObj: blocksWithCode[pos]
      });
    });
    return result;
  },
  getCode: function(position) {
    return blocksWithCode[position];
  },
  hasCode: function(position) {
    return !!blocksWithCode[position];
  },
  storeCode: function(position, code) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.socket.emit('codeChanged', position, code, auth.getAccessToken(), function(err, codeObj) {
        if(err) {
          reject(err);
        } else {
          blocksWithCode[position] = codeObj;
          resolve(codeObj);
        }
      });
    });
  },
  removeCode: function(position) {
    delete blocksWithCode[position];
    this.socket.emit('codeRemoved', position);
  }
};
