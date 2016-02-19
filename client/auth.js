var Vue = require('vue');
var querystring = require('querystring');
var consts = require('../shared/constants');

var githubAccessToken;
var vm;

function login() {
  var url = consts.github.OAUTH_URL + '/authorize'
    + '?client_id=' + consts.github.CLIENT_ID
    + '&scope=' + consts.github.REQUESTED_SCOPE
    + '&redirect_uri=' + consts.github.REDIRECT_URI;
    // TODO pass state too

  location.href = url;
}

function logout() {
  location.href = location.origin;
}

function getAccessToken(code) {
  var url = '/github_access_token/' + code;

  var request = new Request(url, {
  	method: 'GET'
  });

  return fetch(request).then(function(response) {
    return response.json();
  });
}

function getLoggedUserInfo() {
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

module.exports = {
  getAccessToken: function() {
    return githubAccessToken;
  },
  isLogged: function() {
    return !!githubAccessToken;
  },
  init: function() {
    vm = new Vue({
      el: '#userInfo',
      data: {
        loggedIn: false,
        name: ''
      },
      methods: {
        login: login,
        logout: logout
      }
    });

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      getAccessToken(qs.code).then(function(response) {
        if(response.access_token) {
          githubAccessToken = response.access_token;
          getLoggedUserInfo().then(function(me) {
            console.log(me);
            vm.name = me.name;
            vm.loggedIn = true;
          });
        } else {
          alert('Could not log in to github');
        }
      });
    }
  }
};
