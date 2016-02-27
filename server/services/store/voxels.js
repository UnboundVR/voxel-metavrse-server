var fs = require('fs');
var Promise = require('promise');

var basePath = process.cwd() + '/storage';

function getPath(chunkId) {
  return basePath + '/' + chunkId;
}

function ensureDirectoryExists() {
  return new Promise(function(resolve, reject) {
    fs.mkdir(basePath, function(err) {
      resolve();
    });
  });
}

module.exports = {
  saveChunk: function(chunkId, chunk) {
    return new Promise(function(resolve, reject) {
      ensureDirectoryExists().then(function() {
        fs.writeFile(getPath(chunkId), JSON.stringify(chunk), function(err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  },
  loadChunk: function(chunkId) {
    return new Promise(function(resolve, reject) {
      fs.readFile(getPath(chunkId), function(err, data) {
        if(err) {
          resolve(undefined);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
};
