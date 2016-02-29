var consts = require('../../shared/constants');

module.exports = {
  getLoginUrl: function() {
    var request = new Request('/auth/github_client_id', {
      method: 'GET'
    });

    return fetch(request).then(function(response) {
      return response.text();
    }).then(function(clientId) {
      var url = consts.github.OAUTH_URL + '/authorize'
        + '?client_id=' + clientId
        + '&scope=' + consts.github.REQUESTED_SCOPE
        + '&redirect_uri=' + consts.github.REDIRECT_URI;
        // TODO pass state too
      return url;
    });
  },
  getAccessToken: function(code) {
    var url = '/auth/github_access_token/' + code;

    var request = new Request(url, {
    	method: 'GET'
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(response) {
      if(response.access_token) {
        return response.access_token;
      } else {
        throw 'Could not log in to github';
      }
    });
  },
  getLoggedUserInfo: function(githubAccessToken) {
    var request = new Request(consts.github.API_URL + '/user', {
      method: 'GET',
      headers: {
        'Authorization': 'token ' + githubAccessToken
      }
    });

    return fetch(request).then(function(response) {
      return response.json();
    });
  }
};
