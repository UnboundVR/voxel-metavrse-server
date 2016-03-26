import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';

var accessToken;
var name;
var avatarUrl;

export default {
  init() {
    var self = this;
    if(tokenStore.hasToken()) {
      accessToken = tokenStore.getToken();
      return this.fetchUserData();
    }

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      return githubAuth.getAccessToken(qs.code).then(token => {
        accessToken = token;
        tokenStore.storeToken(accessToken);
        return self.fetchUserData();
      }, err => {
        alert(err);
      });
    } else {
      return Promise.resolve();
    }
  },
  login() {
    githubAuth.getLoginUrl().then(url => {
      location.href = url;
    });
  },
  logout() {
    tokenStore.deleteToken();
    location.href = location.origin;
  },
  fetchUserData() {
    return githubAuth.getLoggedUserInfo(accessToken).then(me => {
      name = me.name;
      avatarUrl = me.avatar_url;
    });
  },
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
