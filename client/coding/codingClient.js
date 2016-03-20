var github = require('./github');
var executor = require('./scriptExecutor');
var voxelEngine = require('../voxelEngine');
var blocks = require('../../shared/blocks');
var expandGists = require('../../shared/coding/expandGists');
var auth = require('../auth');
var io = require('socket.io-client');

var blocksWithCode;
var socket;

module.exports = {
  init: function() {
    socket = io.connect(location.host + '/coding');
    return new Promise(function(resolve, reject) {
      socket.emit('requestAllCode', auth.getAccessToken(), function(err, response) {
        if(err) {
          throw new Error('Error fetching code. ' + err);
        }

        if(auth.isLogged()) {
          blocksWithCode = response;
          resolve();
        } else {
          expandGists(response, github.getGist).then(function(result) {
            blocksWithCode = result;
            resolve();
          });
        }
      });
      socket.on('codeChanged', function(position, codeObj) {
        console.log('codeChanged')
        blocksWithCode[position] = codeObj;
        executor.update(position, codeObj.code);
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
    return new Promise(function(resolve, reject) {
      socket.emit('codeChanged', position, code, auth.getAccessToken(), function(err, codeObj) {
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
    socket.emit('codeRemoved', position);
  }
};
