var SINGLE_FILENAME = 'single_file';
var API_URL = 'https://api.github.com';

module.exports = {
  createGist: function(desc, content) {
    var body = {
      description: desc,
      files: {}
    };

    body.files[SINGLE_FILENAME] = {
      content: content
    };

    var request = new Request(API_URL + '/gists', {
    	method: 'POST',
      body: JSON.stringify(body)
    });

    return fetch(request).then(function(response) {
      return response.json();
    });
  },
  getGist: function(id) {
    var request = new Request(API_URL + '/gists/' + id, {
    	method: 'GET'
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

    var request = new Request(API_URL + '/gists/' + id, {
    	method: 'PATCH',
      body: JSON.stringify(body)
    });

    return fetch(request);
  }
};
