import itemTypes from './data/itemTypes.json';
import blockTypes from './data/blockTypes.json';
import toolbar from './data/toolbar.json';
import Promise from 'promise';
import extend from 'extend';
import github from './github';

const SINGLE_FILENAME = 'single_file';

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

function resolve(token, code) {
  if(token) {
    return github.getGist(code, token).then(processGist);
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

function processGist(response) {
  try {
    return {
      id: response.id,
      code: response.files[SINGLE_FILENAME].content,
      author: response.owner ? {
        id: response.owner.id,
        avatar: response.owner.avatar_url,
        login: response.owner.login
      } : {
        id: null,
        avatar: 'https://avatars.githubusercontent.com/u/148100?v=3',
        login: 'anonymous'
      },
      url: response.html_url
    };
  } catch(e) {
    console.log(e);
  }
}

export default {
  getToolbar() {
    return toolbar;
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

      var resultType = extend({}, newType);
      resultType.code = processGist(githubResponse);
      return resultType;
    });
  },
  forkBlockType(token, id, code, material, name) {
    function forkOrCreate() {
      return github.forkGist(id, token).then(forkResponse => {
        return github.updateGist(forkResponse.id, code, token);
      }).catch(err => {
        if(err.statusCode == 422) {
          return github.createGist(code, token);
        } else {
          throw err;
        }
      });
    }


    return forkOrCreate().then((githubResponse) => {
      var newType = {};
      newType.code = githubResponse.id;
      newType.id = ++lastBlockId;
      newType.material = material;
      newType.name = name;
      newType.icon = 'code';
      blockTypes.push(newType);

      var resultType = extend({}, newType);
      resultType.code = processGist(githubResponse);
      return resultType;
    });
  },
  updateBlockType(token, id, code) {
    return github.updateGist(id, code, token);
  }
};
