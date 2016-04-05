import controller from './controller';

export default function(app) {
  app.get('/auth/github_client_info', (req, res) => {
    res.send(controller.getGithubClientInfo());
  });

  app.get('/auth/github_access_token/:code', (req, res) => {
    controller.getAccessToken(req.params.code).then((accessToken) => {
      res.json({
        accessToken: accessToken
      });
    }).catch(function(err) {
      res.status(401).send(err);
    });
  });
}
