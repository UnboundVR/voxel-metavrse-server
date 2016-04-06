import restifyRouter from 'restify-router';
import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import coding from '../coding';

export default function(server) {
  var router = new restifyRouter.Router();

  router.get('/init', (req, res) => {
    res.json({
      materials,
      itemTypes,
      blockTypes: blockTypes.map((type) => {
        type.code = coding.resolve(req.params.token, type.code);
        return type;
      })
    });
  });

  router.applyRoutes(server, '/marketplace');
}
