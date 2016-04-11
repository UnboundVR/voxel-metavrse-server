import consts from '../constants';
import request from 'request-promise';

export default {
  getAccessToken(code) {
    return request.post({
      uri: consts.github.OAUTH_URL + '/access_token',
      headers: {
        'Accept': 'application/json'
      },
      body: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: code
      },
      json: true
    });
  },
  getLoggedUser(token) {
    return request.get({
      uri: consts.github.API_URL + '/user',
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'metavrse.io'
      },
      json: true
    });
  }
};
