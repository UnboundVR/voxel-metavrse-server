import consts from '../constants';

var SINGLE_FILENAME = 'single_file';

export default {
  getGist(id) {
    var request = new Request(consts.github.API_URL + '/gists/' + id, {
      method: 'GET'
    });

    return fetch(request).then(response => response.json()).then(response => {
      return {
        id: response.id,
        code: response.files[SINGLE_FILENAME].content
      };
    });
  }
};
