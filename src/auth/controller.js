import githubAuth from './githubAuth';

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
  }
};
