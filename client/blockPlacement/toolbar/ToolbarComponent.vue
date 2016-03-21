<template>
  <nav id="toolbar" class="bar-tab">
    <ul class="tab-inner">
      <li v-for="item in items" class="tab-item" v-bind:class="{'active': $index === 0}">
        <img class="tab-icon" v-bind:src="'assets/textures/' + item.icon + '.png'">
        <div class="tab-label" data-id="{{item.number}}">{{item.name}} ({{$index+1}})</div>
      </li>
    </ul>
  </nav>
</template>

<script>

import service from './service';

export default {
  name: 'ToolbarComponent',
  data() {
    return {
      items: service.getToolbarItems()
    };
  },
  methods: {

  },
  ready() {
    service.init();
  }
};
</script>

<style>
/* this is using style from other file */
</style>
