import itemTypes from './data/itemTypes.json';
import blockTypes from './data/blockTypes.json';
import defaultToolbar from './data/toolbar.json';
import auth from '../auth';

var toolbars = {};

var lastBlockId = 0;
blockTypes.forEach(blockType => {
  if(blockType.id > lastBlockId) {
    lastBlockId = blockType.id;
  }
});

var lastItemId = 0;
itemTypes.forEach(itemType => {
  if(itemType.id > lastItemId) {
    lastItemId = itemType.id;
  }
});

// function getById(types, id) {
//   for(let i = 0; i < types.length; i++) {
//     let type = types[i];
//     if(type.id == id) {
//       return type;
//     }
//   }
// }

export default {
  getToolbar(token) {
    return auth.getUser(token).then(user => {
      if(!toolbars[user.id]) {
        toolbars[user.id] = defaultToolbar;
      }

      return toolbars[user.id];
    });
  },
  setToolbarItem(token, position, type, id) {
    return auth.getUser(token).then(user => {
      var toolbar = toolbars[user.id];
      toolbar[position] = {type, id};
    });
  },
  removeToolbarItem(token, position) {
    return auth.getUser(token).then(user => {
      var toolbar = toolbars[user.id];
      toolbar[position] = null;
    });
  },
  getAll() {
    return {
      itemTypes,
      blockTypes
    };
  },
  getItemTypes(token, ids) {
    if(typeof ids == 'string') {
      ids = ids.split(',');
    }

    return itemTypes.filter(type => ids.includes(type.id.toString()));
  },
  getBlockTypes(token, ids) {
    if(typeof ids == 'string') {
      ids = ids.split(',');
    }

    return blockTypes.filter(type => ids.includes(type.id.toString()));
  },
  addBlockType(token, codeObj, material, name) {
    var newType = {};
    newType.code = codeObj;
    newType.id = ++lastBlockId;
    newType.material = material;
    newType.name = name;
    newType.icon = 'code';
    blockTypes.push(newType);

    return newType;
  },
  addItemType(token, codeObj, props) {
    var newType = {};
    newType.code = codeObj;
    newType.id = ++lastItemId;
    newType.name = props.name;
    newType.crosshairIcon = props.crosshairIcon;
    newType.adjacentActive = props.adjacentActive;
    newType.icon = 'code';
    itemTypes.push(newType);

    return newType;
  }
};
