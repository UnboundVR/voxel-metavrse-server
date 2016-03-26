import consts  from '../../shared/constants';

export default {
  getLoginUrl() {
    var request = new Request('/auth/github_client_info', {
      method: 'GET'
    });

    return fetch(request).then(function(response) {
      return response.json();
    }).then(function(clientInfo) {
      var url = consts.github.OAUTH_URL + '/authorize'
        + '?client_id=' + clientInfo.clientId
        + '&scope=' + consts.github.REQUESTED_SCOPE
        + '&redirect_uri=' + clientInfo.redirectUri;
        // TODO pass state too
      return url;
    });
  },
  getAccessToken(code) {
    var url = '/auth/github_access_token/' + code;

    var request = new Request(url, {
      method: 'GET'
    });

    return fetch(request).then(function(response) {
      if(response.ok) {
        return response.json();
      }

      return response.text().then(function(errorCode) {
        throw new Error('Could not log in to github. ' + errorCode);
      });
    }).then(function(response) {
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

    return fetch(request).then(function(response) {
      return response.json();
    });
  }
};
