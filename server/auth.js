var request = require('request-promise');
var consts = require('../shared/constants');

module.exports = function(app) {
  app.get('/github_access_token/:code', function(req, res) {
    var url = consts.github.OAUTH_URL + '/access_token';

    request.post({
      uri: url,
      headers: {
        'Accept': 'application/json'
      },
      body: {
        client_id: consts.github.CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.params.code
      },
      json: true
    }).then(function(githubResponse) {
      res.json(githubResponse);
    });
  });
};
