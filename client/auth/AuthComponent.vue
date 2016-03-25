<template>
  <div id="auth-component">
    <nav id="auth-component-menu" class="css_menu">
      <ul v-if="loggedIn">
        <li>
          <img id="auth-component-avatar" width="48px" height="48px" :src="avatarUrl" alt="" />
          <ul>
            <li class="label"><a href="#">{{ name }}</a></li>
            <li><a href="#" v-on:click="logout">Logout</a></li>
          </ul>
        </li>
      </ul>
      <ul v-else>
        <li><a href="#" v-on:click="login">Login</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>

import service from './service';

export default {
  name: 'AuthComponent',
  data() {
    return {
      loggedIn: service.isLoggedIn(),
      name: service.getName(),
      avatarUrl: service.getAvatarUrl(),
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
