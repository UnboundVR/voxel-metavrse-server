import github from './github';

var gists = {};
var dirty = false;

export default {
  getGistIds() {
    return gists;
  },
  isDirty() {
    return dirty;
  },
  resolve(token, code) {
    if(token) {
      return github.getGist(code, token);
    } else {
      return Promise.resolve(code);
    }
  },
  // onCodeChanged(position, code, token, broadcast) {
  //   let updateGithub = () => {
  //     if(gists[position]) {
  //       return github.updateGist(gists[position], code, token); // TODO fork if this is not mine
  //     } else {
  //       return github.createGist(code, token).then(response => {
  //         gists[position] = response.id;
  //         dirty = true;
  //       });
  //     }
  //   };
  //
  //   return updateGithub().then(() => {
  //     let codeObj = {
  //       id: gists[position],
  //       code: code
  //     };
  //     broadcast(position, codeObj);
  //     return codeObj;
  //   });
  // },
  // onCodeRemoved(position, broadcast) {
  //   delete gists[position];
  //   broadcast(position);
  //   dirty = true;
  // }
};
