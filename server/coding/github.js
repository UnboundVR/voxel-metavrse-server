var consts = require('../constants');
var request = require('request-promise');

var SINGLE_FILENAME = 'single_file';
var HARDCODED_DESC = 'created in metavrse.io';

module.exports = {
  createGist: function(content, token) {
    var body = {
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
  getGist: function(id, token) {
    return request.get({
      uri: consts.github.API_URL + '/gists/' + id,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    }).then(function(response) {
      return {
        id: response.id,
        code: response.files[SINGLE_FILENAME].content
      };
    });
  },
  updateGist: function(id, code, token) {
    var body = {
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
