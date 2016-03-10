var githubAuth = require('./githubAuth');
var consts = require('../../shared/constants');

module.exports = {
  getGithubClientInfo: function() {
    return {
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: consts.github.REDIRECT_URI.replace('<port>', process.env.PORT)
    };
  },
  getAccessToken: function(code) {
    return githubAuth.getAccessToken(code).then(function(githubResponse) {
      if(githubResponse.access_token) {
        return githubResponse.access_token;
      } else {
        return Promise.reject(githubResponse.error);
      }
    });
  }
};
