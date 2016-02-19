// TODO move the whole github interaction to server?
var consts = require('../../shared/constants');
var auth = require('../auth');

var SINGLE_FILENAME = 'single_file';

function getHeaders() {
  if(auth.isLogged()) {
    return {
      'Authorization': 'token ' + auth.getAccessToken()
    };
  }

  return {};
}

module.exports = {
  createGist: function(desc, content) {
    var body = {
      description: desc,
      files: {}
    };

    body.files[SINGLE_FILENAME] = {
      content: content
    };

    var request = new Request(consts.github.API_URL + '/gists', {
    	method: 'POST',
      body: JSON.stringify(body),
      headers: getHeaders()
    });

    return fetch(request).then(function(response) {
      return response.json();
    });
  },
  getGist: function(id) {
    var request = new Request(consts.github.API_URL + '/gists/' + id, {
    	method: 'GET',
      headers: getHeaders()
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(response) {
      return {
        desc: response.description,
        code: response.files[SINGLE_FILENAME].content
      }
    });
  },
  updateGist: function(id, code) { // only works when authenticated
    var body = {
      files: {}
    };

    body.files[SINGLE_FILENAME] = {
      content: code
    };

    var request = new Request(consts.github.API_URL + '/gists/' + id, {
    	method: 'PATCH',
      body: JSON.stringify(body),
      headers: getHeaders()
    });

    return fetch(request).then(function(response) {
      if(!response.ok) {
        throw response.statusText;
      }

      return response;
    });
  }
};
