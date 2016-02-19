var Vue = require('vue');
var querystring = require('querystring');
var consts = require('../shared/constants');

var githubId;

function login() {
  var url = consts.github.OAUTH_URL + '/authorize'
    + '?client_id=' + consts.github.CLIENT_ID
    + '&scope=' + consts.github.REQUESTED_SCOPE
    + '&redirect_uri=' + consts.github.REDIRECT_URI;
    // TODO pass state too

  location.href = url;
}

function getAccessToken(code) {
  var url = consts.server.URL + '/github_access_token/' + code;

  var request = new Request(url, {
  	method: 'GET'
  });

  return fetch(request).then(function(response) {
    return response.json();
  });
}

module.exports = {
  getGithubId: function() {
    return githubId;
  },
  init: function() {
    var vm = new Vue({
      el: '#userInfo',
      data: {
      },
      methods: {
        login: login
      }
    });

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too
    if(qs.code) {
      getAccessToken(qs.code).then(function(response) {
        console.log(response);
      });
    }
  }
};
