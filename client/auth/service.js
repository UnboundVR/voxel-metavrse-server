import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';

var accessToken;
var name;
var avatarUrl;

function init() {
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
    name = me.name;
    avatarUrl = me.avatar_url;
  });
}

export default {
  init,
  login,
  logout,
  fetchUserData,
  getAccessToken() {
    return accessToken;
  },
  getName() {
    return name;
  },
  getAvatarUrl() {
    return avatarUrl;
  },
  isLoggedIn() {
    return !!accessToken;
  }
};
