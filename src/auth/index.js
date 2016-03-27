var controller = require('./controller');

module.exports = function(app) {
  app.get('/auth/github_client_info', function(req, res) {
    res.send(controller.getGithubClientInfo());
  });

  app.get('/auth/github_access_token/:code', function(req, res) {
    controller.getAccessToken(req.params.code).then(function(accessToken) {
      res.json({
        accessToken: accessToken
      });
    }).catch(function(err) {
      res.status(401).send(err);
    });
  });
};
