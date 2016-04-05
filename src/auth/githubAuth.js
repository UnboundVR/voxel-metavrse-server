import consts from '../constants';
import request from 'request-promise';

export default {
  getAccessToken: (code) => {
    let url = consts.github.OAUTH_URL + '/access_token';

    return request.post({
      uri: url,
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
  }
};
