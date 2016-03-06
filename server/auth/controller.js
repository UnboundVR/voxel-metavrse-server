var getAccessToken = require('./getAccessToken');

module.exports = {
  getGithubClientId: function() {
    return process.env.GITHUB_CLIENT_ID;
  },
  getAccessToken: getAccessToken
};
