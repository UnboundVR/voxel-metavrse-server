var Vue = require('vue');
var querystring = require('querystring');
var githubAuth = require('./githubAuth');
var tokenStore = require('./tokenStore');

var accessToken;
var vm;

function login() {
  githubAuth.getLoginUrl().then(function(url) {
    location.href = url;
  });
}

function logout() {
  tokenStore.deleteToken();
  location.href = location.origin;
}

function fetchUserData() {
  return githubAuth.getLoggedUserInfo(accessToken).then(function(me) {
    vm.name = me.name;
    vm.loggedIn = true;
  });
}

module.exports = {
  getName: function() {
    return vm.name;
  },
  getAccessToken: function() {
    return accessToken;
  },
  isLogged: function() {
    return !!accessToken;
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

    if(tokenStore.hasToken()) {
      accessToken = tokenStore.getToken();
      return fetchUserData();
    }

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      return githubAuth.getAccessToken(qs.code).then(function(token) {
        accessToken = token;
        tokenStore.storeToken(accessToken);
        return fetchUserData();
      }, function(err) {
        alert(err);
      });
    } else {
      return Promise.resolve();
    }
  }
};
