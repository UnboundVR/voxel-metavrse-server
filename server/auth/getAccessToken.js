var consts = require('../../shared/constants');
var request = require('request-promise');

module.exports = function(code) {
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
  }).then(function(githubResponse) {
    if(githubResponse.access_token) {
      return githubResponse.access_token;
    } else {
      throw githubResponse.error;
    }
  });
};
