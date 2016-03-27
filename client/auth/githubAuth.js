import consts  from '../constants';

export default {
  getLoginUrl() {
    var request = new Request('/auth/github_client_info', {
      method: 'GET'
    });

    return fetch(request).then(response => {
      return response.json();
    }).then(clientInfo =>
      consts.github.OAUTH_URL + '/authorize'
      + '?client_id=' + clientInfo.clientId
      + '&scope=' + consts.github.REQUESTED_SCOPE
      + '&redirect_uri=' + clientInfo.redirectUri); // TODO pass state too
  },
  getAccessToken(code) {
    var url = '/auth/github_access_token/' + code;

    var request = new Request(url, {
      method: 'GET'
    });

    return fetch(request).then(response => {
      if(response.ok) {
        return response.json();
      }

      return response.text().then(errorCode => {
        throw new Error('Could not log in to github. ' + errorCode);
      });
    }).then(response => {
      if(response.accessToken) {
        return response.accessToken;
      } else {
        throw new Error('Could not log in to github');
      }
    });
  },
  getLoggedUserInfo(githubAccessToken) {
    var request = new Request(consts.github.API_URL + '/user', {
      method: 'GET',
      headers: {
        'Authorization': 'token ' + githubAccessToken
      }
    });

    return fetch(request).then(response => response.json());
  }
};
