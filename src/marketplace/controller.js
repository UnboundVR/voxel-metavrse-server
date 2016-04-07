import itemTypes from './itemTypes.json';
import blockTypes from './blockTypes.json';
import materials from './materials.json';
import toolbar from './toolbar.json';
import Promise from 'promise';
import extend from 'extend';
import github from './github';

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

function resolve(token, code) {
  if(token) {
    return github.getGist(code, token);
  } else {
    return Promise.resolve(code);
  }
}

function resolveTypes(token, types, ids) {
  let promises = types.filter(type => ids.includes(type.id)).map(type => {
    if(type.code) {
      return resolve(token, type.code).then(codeObj => {
        let res = extend({}, type);
        res.code = codeObj;
        return res;
      });
    } else {
      return type;
    }
  });

  return Promise.all(promises);
}

export default {
  initUser() {
    return {
      materials,
      toolbar
    };
  },
  getAll() {
    return {
      itemTypes,
      blockTypes
    };
  },
  getItemTypes(token, ids) {
    return resolveTypes(token, itemTypes, ids);
  },
  getBlockTypes(token, ids) {
    return resolveTypes(token, blockTypes, ids);
  },
  addBlockType(token, code, material, name) {
    return github.createGist(code, token).then(githubResponse => {
      var newType = {};
      newType.code = githubResponse.id;
      newType.id = ++lastBlockId;
      newType.material = material;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      return newType;
    });
  }
};
