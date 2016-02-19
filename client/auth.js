var Vue = require('vue');
var querystring = require('querystring');
var consts = require('../shared/constants');

var githubAccessToken;
var vm;

function login() {
  var request = new Request('/github_client_id', {
  	method: 'GET'
  });

  fetch(request).then(function(response) {
    return response.text();
  }).then(function(clientId) {
    var url = consts.github.OAUTH_URL + '/authorize'
      + '?client_id=' + clientId
      + '&scope=' + consts.github.REQUESTED_SCOPE
      + '&redirect_uri=' + consts.github.REDIRECT_URI;
      // TODO pass state too

    location.href = url;
  });
}

function logout() {
  localStorage.removeItem('githubToken');
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

function fetchUserData() {
  getLoggedUserInfo().then(function(me) {
    vm.name = me.name;
    vm.loggedIn = true;
  });
}

module.exports = {
  getName: function() {
    return vm.name;
  },
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

    var token = localStorage.getItem('githubToken');
    if(token) {
      githubAccessToken = token;
      fetchUserData();
      return;
    }

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      getAccessToken(qs.code).then(function(response) {
        if(response.access_token) {
          githubAccessToken = response.access_token;
          localStorage.setItem('githubToken', githubAccessToken);
          fetchUserData();
        } else {
          alert('Could not log in to github');
        }
      });
    }
  }
};
