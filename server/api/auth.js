var controller = require('./controllers/auth');

module.exports = function(app) {
  app.get('/github_client_id', function(req, res) {
    res.send(controller.getGithubClientId());
  });

  app.get('/github_access_token/:code', function(req, res) {
    controller.getAccessToken(req.params.code).then(function(githubResponse) {
      res.json(githubResponse);
    });
  });
};
