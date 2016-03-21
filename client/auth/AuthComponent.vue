<template>
  <div id="userInfo">
    <h3>User info</h3>
    <button v-if="loggedIn" v-on:click="logout">Logout</button>
    <button v-else v-on:click="login">Login</button>
    <span v-if="loggedIn">{{name}}</span>
  </div>
</template>

<script>

import service from './service';

export default {
  name: 'AuthComponent',
  data() {
    return {
      loggedIn: service.isLoggedIn(),
      name: service.getName()
    };
  },
  methods: {
    login: service.login,
    logout: service.logout
  }
};
</script>

<style>
#userInfo {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
