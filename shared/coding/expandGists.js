var extend = require('extend');

module.exports = function(gists, getGist) {
  var promises = [];
  Object.keys(gists).forEach(function(position) {
    promises.push(getGist(gists[position]).then(function(codeObj) {
      return extend(codeObj, {position: position});
    }));
  });

  var result = {};
  return Promise.all(promises).then(function(codeObjs) {
    codeObjs.forEach(function(codeObj) {
      result[codeObj.position] = {
        id: codeObj.id,
        code: codeObj.code
      };
    });

    return result;
  });
};
