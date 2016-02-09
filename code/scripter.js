var codemirror = require('./codemirror');
var github = require('./github');

module.exports = function(position, callback ) {
  codemirror.openNew(position, function(value) {
    if(confirm('Save?')) {
      var name = prompt('Tell me the name of the gist');
      github.createGist(name, value).then(function(gistUrl) {
        alert('The gist URL is ' + gistUrl + ' and this is now an obsidian block');
        callback();
      });
    }
  })
};
