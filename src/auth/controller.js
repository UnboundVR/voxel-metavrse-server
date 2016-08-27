import githubAuth from './githubAuth';

var users = {};

export default {
  getGithubClientInfo() {
    return {
      clientId: githubAuth.getClientId()
    };
  },
  async getAccessToken(code) {
    let githubResponse = await githubAuth.getAccessToken(code);

    if (githubResponse.access_token) {
      return githubResponse.access_token;
    } else {
      throw new Error(githubResponse.error);
    }
  },
  async getLoggedUser(token) {
    if(!users[token]) {
      let user = await githubAuth.getLoggedUser(token);
      users[token] = user;
    }
    
    return users[token];
  }
};
