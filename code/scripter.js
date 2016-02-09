var codemirror = require('./codemirror');
var github = require('./github');
var blocks = require('./blocks');
var auth = require('./auth');

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
      blocks.storeGistId(position, response.id);
      alert('The gist URL is ' + response.html_url + ' and this is now an obsidian block');
    });
  });
};

var openExisting = function(position, desc, initialCode) {
  var title = 'Editing the code of the voxel at ' + position + ' (' + desc + ')';

  return codemirror.open(title, initialCode).then(function(value) {
    var githubId = auth.getGithubId();

    if(githubId) {
      return github.updateGist(blocks.getGistId(position), value).then(function(response) {
        alert('Existing Gist was updated correctly');
      });
    } else {
      return github.createGist(desc, value).then(function(response) {
        blocks.storeGistId(position, response.id);
        alert('The new gist URL is ' + response.html_url + ' and this is now an obsidian block');
      });
    }
  });
};

module.exports = function(position) {
  var gistId = blocks.getGistId(position);

  if(gistId) {
    return github.getGist(gistId).then(function(response) {
      return openExisting(position, response.desc, response.code);
    });
  } else {
    return openNew(position);
  }
};
