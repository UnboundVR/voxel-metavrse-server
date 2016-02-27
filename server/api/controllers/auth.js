var request = require('request-promise');
var consts = require('../../../shared/constants');

module.exports = {
  getGithubClientId: function() {
    return process.env.GITHUB_CLIENT_ID;
  },
  getAccessToken: function(code) {
    var url = consts.github.OAUTH_URL + '/access_token';

    return request.post({
      uri: url,
      headers: {
        'Accept': 'application/json'
      },
      body: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: code
      },
      json: true
    });
  }
};
