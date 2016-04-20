import consts from '../constants';
import request from 'request-promise';

const SINGLE_FILENAME = 'single_file';
const HARDCODED_DESC = 'created in metavrse.io';

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
  getGist(id, revision, token) {
    return request.get({
      uri: consts.github.API_URL + '/gists/' + id + '/' + revision,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
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
  },
  forkGist(id, token) {
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
