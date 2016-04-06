import restifyRouter from 'restify-router';
import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import coding from '../coding';
import Promise from 'promise';
import extend from 'extend';

export default function(server) {
  var router = new restifyRouter.Router();

  function resolveBlockTypes(token) {
    let promises = blockTypes.map(blockType => {
      if(blockType.code) {
        return coding.resolve(token, blockType.code).then(codeObj => {
          let res = extend({}, blockType);
          res.code = codeObj;
          return res;
        });
      } else {
        return blockType;
      }
    });

    return Promise.all(promises);
  }

  router.get('/init', (req, res) => {
    resolveBlockTypes(req.params.token).then(resolvedBlockTypes => {
      res.json({
        materials,
        itemTypes,
        blockTypes: resolvedBlockTypes
      });
    });
  });

  router.applyRoutes(server, '/marketplace');
}
