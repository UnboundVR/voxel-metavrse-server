var fs = require('fs');
var Promise = require('promise');

module.exports = function(subPath) {
  if(subPath && subPath.indexOf('/') != -1) {
    throw 'subPath must be exactly one folder deep';
  }

  var storageFolderPath = process.cwd() + '/storage'
  var basePath = new String(storageFolderPath);
  if(subPath) {
    basePath += ('/' + subPath);
  }

  function ensureDirectoryExists(path) {
    return new Promise(function(resolve, reject) {
      var createActualPath = function() {
        fs.mkdir(path, function(err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      };

      if(subPath && path != storageFolderPath) {
        ensureDirectoryExists(storageFolderPath).then(createActualPath);
      } else {
        createActualPath();
      }
    });
  }

  return {
    save: function(path, obj) {
      return new Promise(function(resolve, reject) {
        ensureDirectoryExists(basePath).then(function() {
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
        ensureDirectoryExists(basePath).then(function() {
          fs.readFile(basePath + '/' + path, function(err, data) {
            if(err) {
              resolve(null);
            } else {
              resolve(JSON.parse(data));
            }
          });
        });
      });
    }
  };
};
