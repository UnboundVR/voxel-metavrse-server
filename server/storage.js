var fs = require('fs');
var Promise = require('promise');

var basePath = process.cwd() + '/chunks';

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
  saveChunk: function(chunk) {
    var chunkId = chunk.chunkId;
    console.log('saving ' + chunkId)
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
    console.log('loading ' + chunkId);
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
