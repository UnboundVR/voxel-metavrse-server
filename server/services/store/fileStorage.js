var fs = require('fs');
var Promise = require('promise');

var basePath = process.cwd() + '/storage';

function ensureDirectoryExists() {
  return new Promise(function(resolve, reject) {
    fs.mkdir(basePath, function(err) {
      resolve();
    });
  });
}

module.exports = {
  save: function(path, obj) {
    return new Promise(function(resolve, reject) {
      ensureDirectoryExists().then(function() {
        fs.writeFile(basePath + '/' + path, JSON.stringify(obj), function(err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  },
  load: function(path) {
    return new Promise(function(resolve, reject) {
      ensureDirectoryExists().then(function() {
        fs.readFile(basePath + '/' + path, function(err, data) {
          if(err) {
            resolve({});
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
    });
  }
};
