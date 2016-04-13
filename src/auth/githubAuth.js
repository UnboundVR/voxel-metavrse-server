import consts from '../constants';
import request from 'request-promise';

var githubClientId;
var githubSecret;

export default {
  getAccessToken(code) {
    return request.post({
      uri: consts.github.OAUTH_URL + '/access_token',
      headers: {
        'Accept': 'application/json'
      },
      body: {
        client_id: process.env.GITHUB_CLIENT_ID || githubClientId,
        client_secret: process.env.GITHUB_SECRET || githubSecret,
        code: code
      },
      json: true
    });
  },
  getClientId() {
    return process.env.GITHUB_CLIENT_ID || githubClientId;
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
  },
  setGithubApp(clientId, secret) {
    if(process.env.GITHUB_CLIENT_ID || process.env.GITHUB_SECRET) {
      throw new Error('Already using info from env variables');
    }

    if(githubClientId || githubSecret) {
      throw new Error('Github app already set');
    }

    githubClientId = clientId;
    githubSecret = secret;
  }
};
