import fs from 'fs';
import Promise from 'promise';

export default function(subPath) {
  if (subPath && subPath.indexOf('/') != -1) {
    throw 'subPath must be exactly one folder deep';
  }

  var storageFolderPath = process.cwd() + '/storage';
  var basePath = new String(storageFolderPath);

  if (subPath) {
    basePath += ('/' + subPath);
  }

  function ensureDirectoryExists(path) {
    return new Promise(resolve => {
      let createActualPath = () => {
        fs.mkdir(path, () => {
          resolve();
        });
      };

      if (subPath && path != storageFolderPath) {
        ensureDirectoryExists(storageFolderPath).then(createActualPath);
      } else {
        createActualPath();
      }
    });
  }

  return {
    save(path, obj) {
      return new Promise((resolve, reject) => {
        ensureDirectoryExists(basePath).then(() => {
          fs.writeFile(basePath + '/' + path, JSON.stringify(obj), err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
    },
    load(path) {
      return new Promise(resolve => {
        ensureDirectoryExists(basePath).then(() => {
          fs.readFile(basePath + '/' + path, (err, data) => {
            if (err) {
              resolve(null);
            } else {
              resolve(JSON.parse(data));
            }
          });
        });
      });
    }
  };
}
