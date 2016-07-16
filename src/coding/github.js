import consts from '../constants';
import request from 'request-promise';

const SINGLE_FILENAME = 'single_file';
const HARDCODED_DESC = 'created in metavrse.io';

export default {
  createGist(token, content) {
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
  getGist(token, id, revision) {
    return request.get({
      uri: consts.github.API_URL + '/gists/' + id + '/' + revision,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    });
  },
  updateGist(token, id, code) {
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
  },
  forkGist(token, id) {
    return request({
      method: 'POST',
      uri: consts.github.API_URL + '/gists/' + id + '/forks',
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    });
  }
};
