import Vue from 'vue';
import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';

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

export default {
  getName() {
    return vm.name;
  },
  getAccessToken() {
    return accessToken;
  },
  isLogged() {
    return !!accessToken;
  },
  init() {
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
