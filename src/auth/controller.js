import githubAuth from './githubAuth';

var users = {};

export default {
  getGithubClientInfo() {
    return {
      clientId: process.env.GITHUB_CLIENT_ID
    };
  },
  getAccessToken(code) {
    return githubAuth.getAccessToken(code).then((githubResponse) => {
      if (githubResponse.access_token) {
        return githubResponse.access_token;
      } else {
        return Promise.reject(githubResponse.error);
      }
    });
  },
  getLoggedUser(token) {
    if(!users[token]) {
      return githubAuth.getLoggedUser(token).then(user => {
        users[token] = user;
        return user;
      });
    } else {
      return Promise.resolve(users[token]);
    }
  }
};
