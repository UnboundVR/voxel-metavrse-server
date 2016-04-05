import storage from './store';
import github from './github';
import expandGists from './expandGists';

var gists = {};
var dirty = false;

export default {
  getGistIds() {
    return gists;
  },
  isDirty() {
    return dirty;
  },
  init() {
    return storage.loadGists().then(res => {
      if (res) {
        gists = res;
      }
    });
  },
  storeCode() {
    if (dirty) {
      return storage.saveGists(gists).then(() => {
        dirty = false;
      });
    } else {
      return Promise.resolve();
    }
  },
  getAllCode(token) {
    if (token) {
      var getGist = gistId => {
        return github.getGist(gistId, token);
      };
      return expandGists(gists, getGist);
    } else {
      return Promise.resolve(gists);
    }
  },
  onCodeChanged(position, code, token, broadcast) {
    let updateGithub = () => {
      if (gists[position]) {
        return github.updateGist(gists[position], code, token); // TODO fork if this is not mine
      } else {
        return github.createGist(code, token).then(response => {
          gists[position] = response.id;
          dirty = true;
        });
      }
    };

    return updateGithub().then(() => {
      let codeObj = {
        id: gists[position],
        code: code
      };
      broadcast(position, codeObj);
      return codeObj;
    });
  },
  onCodeRemoved(position, broadcast) {
    delete gists[position];
    broadcast(position);
    dirty = true;
  }
};
