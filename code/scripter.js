var codemirror = require('./codemirror');
var github = require('./github');
var blocks = require('./blocks');

var openNew = function(position) {
  var title = 'Editing the code of the voxel at ' + position;
  var initialCode = 'console.log(\'hello w0rld\')\n';

  return codemirror.open(title, initialCode).then(function(value) {
    var desc = prompt('Tell me the description of the gist');
    if(!desc) {
      return new Promise(function(resolve, reject) {
        reject('You must enter a description');
      });
    }
    
    return github.createGist(desc, value).then(function(response) {
      alert('The gist URL is ' + response.html_url + ' and this is now an obsidian block');
    });
  });
};

var openExisting = function(name, initialCode) {
  codeMirror.open(title, initialCode, function(value) {
    return github.updateGist(url, value).then(function(response) {
      alert('The stuff was updated correctly');
    });
  });
};

module.exports = function(position) {
  return openNew(position);
};
