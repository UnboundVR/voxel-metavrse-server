var codemirror = require('./codemirror');
var github = require('./github');
var coding = require('./coding');
var auth = require('../auth');
var executor = require('./scriptExecutor');

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
      alert('The gist URL is ' + response.html_url);
      coding.storeGistId(position, response.id);
      executor.create(position, value);
    });
  });
};

var openExisting = function(position, desc, initialCode) {
  var title = 'Editing the code of the voxel at ' + position.join('|') + ' (' + desc + ')';

  return codemirror.open(title, initialCode).then(function(value) {
    var githubId = auth.getGithubId();

    if(githubId) {
      return github.updateGist(coding.getGistId(position), value).then(function(response) {
        alert('Existing Gist was updated correctly');
        executor.update(position, value);
      });
    } else {
      return github.createGist(desc, value).then(function(response) {
        alert('The new gist URL is ' + response.html_url);
        coding.storeGistId(position, response.id);
        executor.update(position, value);
      });
    }
  });
};

module.exports = function(position) {
  var gistId = coding.getGistId(position);

  if(gistId) {
    return github.getGist(gistId).then(function(response) {
      return openExisting(position, response.desc, response.code);
    });
  } else {
    return openNew(position);
  }
};
