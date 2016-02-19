var request = require('request-promise');
var consts = require('../shared/constants');

module.exports = function(app) {
  app.get('/github_client_id', function(req, res) {
    res.send(process.env.GITHUB_CLIENT_ID);
  });

  app.get('/github_access_token/:code', function(req, res) {
    var url = consts.github.OAUTH_URL + '/access_token';

    request.post({
      uri: url,
      headers: {
        'Accept': 'application/json'
      },
      body: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.params.code
      },
      json: true
    }).then(function(githubResponse) {
      res.json(githubResponse);
    });
  });
};
