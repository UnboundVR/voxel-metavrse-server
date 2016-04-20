import controller from './controller';
import restifyRouter from 'restify-router';
import githubAuth from './githubAuth';

export default {
  init(server) {
    var router = new restifyRouter.Router();

    router.get('/github_client_info', (req, res) => {
      res.send(controller.getGithubClientInfo());
    });

    router.get('/github_access_token/:code', (req, res) => {
      controller.getAccessToken(req.params.code).then((accessToken) => {
        res.json({
          accessToken: accessToken
        });
      }).catch(function(err) {
        res.status(401).send(err);
      });
    });

    router.put('/github_app/:clientId/:secret', (req, res) => {
      try {
        githubAuth.setGithubApp(req.params.clientId, req.params.secret);
        res.status(200);
        res.send('Yay');
      } catch(e) {
        res.status(500);
        res.send(e);
      }
    });

    router.applyRoutes(server, '/auth');
  },
  getUser: controller.getLoggedUser.bind(controller)
};
