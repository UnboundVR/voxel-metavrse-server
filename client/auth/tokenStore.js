export default {
  deleteToken: function() {
    localStorage.removeItem('authToken');
  },
  storeToken: function(token) {
    localStorage.setItem('authToken', token);
  },
  getToken: function() {
    return localStorage.getItem('authToken');
  },
  hasToken: function() {
    return !!this.getToken();
  }
};
