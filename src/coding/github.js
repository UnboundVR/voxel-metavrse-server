import consts from '../constants';
import request from 'request-promise';

var SINGLE_FILENAME = 'single_file';
var HARDCODED_DESC = 'created in metavrse.io';

export default {
  createGist(content, token) {
    let body = {
      description: HARDCODED_DESC,
      files: {}
    };

    body.files[SINGLE_FILENAME] = {
      content: content
    };

    return request.post({
      uri: consts.github.API_URL + '/gists',
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      body: body,
      json: true
    });
  },
  getGist(id, token) {
    return request.get({
      uri: consts.github.API_URL + '/gists/' + id,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    }).then(response => {
      return {
        id: response.id,
        code: response.files[SINGLE_FILENAME].content
      };
    });
  },
  updateGist(id, code, token) {
    let body = {
      files: {}
    };

    body.files[SINGLE_FILENAME] = {
      content: code
    };

    return request({
      method: 'PATCH',
      body: body,
      uri: consts.github.API_URL + '/gists/' + id,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    });
  }
};
