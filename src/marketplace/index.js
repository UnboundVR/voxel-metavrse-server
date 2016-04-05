import restifyRouter from 'restify-router';
import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';

export default function(server) {
  var router = new restifyRouter.Router();

  router.get('/init', (req, res) => {
    res.json({
      materials,
      itemTypes,
      blockTypes
    });
  });

  router.applyRoutes(server, '/marketplace');
}
