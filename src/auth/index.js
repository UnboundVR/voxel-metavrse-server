import controller from './controller';
import restifyRouter from 'restify-router';



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

    router.applyRoutes(server, '/auth');
  },
  getUser: controller.getLoggedUser.bind(controller)
};
