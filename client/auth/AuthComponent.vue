<template>
  <div id="auth-component">
    <nav id="auth-component-menu" class="css_menu">
      <ul v-if="loggedIn">
        <li>
          <img id="auth-component-avatar" :src="avatarUrl" alt="" />
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
      avatarUrl: service.getAvatarUrl() + '&s=48',
    };
  },
  methods: {
    login: service.login,
    logout: service.logout
  }
};
</script>

<style lang='scss'>

@import '../../assets/css/_cssmenu';

#auth-component {
  position: absolute;
  top: 10px;
  left: 10px;

  #auth-component-avatar {
    border-radius: 25px;
  }
}

</style>
