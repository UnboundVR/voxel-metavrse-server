export default {
  deleteToken() {
    localStorage.removeItem('authToken');
  },
  storeToken(token) {
    localStorage.setItem('authToken', token);
  },
  getToken() {
    return localStorage.getItem('authToken');
  },
  hasToken() {
    return !!this.getToken();
  }
};
