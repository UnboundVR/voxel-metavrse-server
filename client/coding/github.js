var consts = require('../../shared/constants');

var SINGLE_FILENAME = 'single_file';

module.exports = {
  getGist: function(id) {
    var request = new Request(consts.github.API_URL + '/gists/' + id, {
    	method: 'GET'
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(response) {
      return {
        id: response.id,
        code: response.files[SINGLE_FILENAME].content
      }
    });
  }
};
