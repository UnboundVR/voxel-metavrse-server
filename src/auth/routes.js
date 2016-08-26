import controller from './controller';
import restifyRouter from 'restify-router';
import githubAuth from './githubAuth';

export default {
  init(server) {
    var router = new restifyRouter.Router();

    router.get('/github_client_info', (req, res) => {
      try {
        res.send(controller.getGithubClientInfo());
      } catch(err) {
        console.log('Error getting Github client info', err);
        res.send(500, err);
      }
    });

    router.get('/github_access_token/:code', async (req, res) => {
      try {
        let accessToken = controller.getAccessToken(req.params.code);
        res.json({
          accessToken
        });
      } catch(err) {
        console.log('Error getting Github access token', err);
        res.send(401, err);
      }
    });

    // FIXME this one will likely be deprecated when we move to a microservice
    router.put('/github_app/:clientId/:secret', (req, res) => {
      try {
        githubAuth.setGithubApp(req.params.clientId, req.params.secret);
        res.send(200, 'Yay');
      } catch(err) {
        console.log('Error setting github client ID and secret', err);
        res.send(500, err);
      }
    });

    router.applyRoutes(server, '/auth');
  }
};
