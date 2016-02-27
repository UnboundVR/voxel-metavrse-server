var fs = require('fs');
var Promise = require('promise');

var basePath = process.cwd() + '/storage';
var gistsPath = basePath + '/gists.json';

function ensureDirectoryExists() {
  return new Promise(function(resolve, reject) {
    fs.mkdir(basePath, function(err) {
      resolve();
    });
  });
}

module.exports = {
  saveGists: function(gists) {
    return new Promise(function(resolve, reject) {
      ensureDirectoryExists().then(function() {
        fs.writeFile(gistsPath, JSON.stringify(gists), function(err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  },
  loadGists: function() {
    return new Promise(function(resolve, reject) {
      fs.readFile(gistsPath, function(err, data) {
        if(err) {
          resolve({});
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
};
