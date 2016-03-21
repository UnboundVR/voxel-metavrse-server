import Vue from 'vue';
import AuthComponent from './AuthComponent.vue';
import service from './service';

export default {
  getName: service.getName,
  getAccessToken: service.getAccessToken,
  isLogged: service.isLoggedIn,
  init() {
    Vue.component('auth-component', AuthComponent);
    return service.init();
  }
};
