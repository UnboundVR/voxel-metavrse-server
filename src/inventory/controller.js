import auth from '../auth';
import clone from 'clone';
import storage from './storage';

async function addBlockOrItem(dbConn, token, codeObj, props, type) {
  let user = await auth.getUser(token);
  console.log(`Adding new ${type} for user ${user.login}`);

  let add;

  let newType = {
    code: codeObj,
    name: props.name,
    icon: 'code',
    owner: user.login
  };

  if(type == 'item') {
    add = storage.addItemType;
    newType.crosshairIcon = props.crosshairIcon;
    newType.adjacentActive = props.adjacentActive;
  } else {
    add = storage.addBlockType;
    newType.material = props.material;
  }

  await add(dbConn, newType);

  return newType;
}

async function updateBlockOrItemCode(dbConn, token, id, codeObj, type) {
  let user = await auth.getUser(token);
  console.log(`Updating ${type} ${id} for user ${user.login}`);

  let get, add, update;

  if(type == 'item') {
    get = storage.getItemType;
    add = storage.addItemType;
    update = storage.updateItemType;
  } else {
    get = storage.getBlockType;
    add = storage.addBlockType;
    update = storage.updateBlockType;
  }

  let original = await get(dbConn, id);
  if(original.owner != user.login) {
    throw new Error(`${type} ${id} belongs to ${original.owner} - ${user.login} doesn't have access.`);
  }

  let updated = clone(original);
  updated.code = codeObj;
  delete updated.newerVersion;
  await add(dbConn, updated);

  original.newerVersion = updated.id;
  await update(dbConn, original);

  return updated;
}

export default {
  async getToolbar(dbConn, token) {
    let user = await auth.getUser(token);

    return await storage.getToolbar(dbConn, user.login);
  },
  async setToolbarItem(dbConn, token, position, type, id) {
    let user = await auth.getUser(token);

    await storage.updateToolbarItem(dbConn, user.login, position, {type, id});
  },
  async removeToolbarItem(dbConn, token, position) {
    let user = await auth.getUser(token);

    await storage.updateToolbarItem(dbConn, user.login, position, null);
  },
  async getAll(dbConn) {
    let itemTypes = await storage.getAllItemTypes(dbConn);
    let blockTypes = await storage.getAllBlockTypes(dbConn);

    return {
      itemTypes,
      blockTypes
    };
  },
  async getItemTypes(dbConn, token, ids) {
    return await storage.getItemTypes(dbConn, ids);
  },
  async getBlockTypes(dbConn, token, ids) {
    return await storage.getBlockTypes(dbConn, ids);
  },
  async updateBlockCode(dbConn, token, id, codeObj) {
    return await updateBlockOrItemCode(dbConn, token, id, codeObj, 'block');
  },
  async updateItemCode(dbConn, token, id, codeObj) {
    return await updateBlockOrItemCode(dbConn, token, id, codeObj, 'item');
  },
  async addBlockType(dbConn, token, codeObj, props) {
    return await addBlockOrItem(dbConn, token, codeObj, props, 'block');
  },
  async addItemType(dbConn, token, codeObj, props) {
    return await addBlockOrItem(dbConn, token, codeObj, props, 'item');
  }
};
