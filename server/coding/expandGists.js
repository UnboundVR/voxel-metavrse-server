module.exports = function(gists, getGist) {
  var result = {};
  var promises = Object.keys(gists).map(function(position) {
    return getGist(gists[position]).then(function(codeObj) {
      result[position] = codeObj;
    });
  });

  return Promise.all(promises).then(function() {
    return result;
  });
};
