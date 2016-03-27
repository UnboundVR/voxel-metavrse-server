<template>
  <nav id="toolbar-component" class="bar-tab">
    <ul class="tab-inner">
      <li v-for="item in items" class="tab-item" v-bind:class="{'active': $index === 0}">
        <img class="tab-icon" v-bind:src="'assets/textures/' + item.icon + '.png'">
        <div class="tab-label" data-id="{{ item.number }}">{{ item.name }} ({{ $index+1 }})</div>
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
  ready() {
    service.hookSelection();
  }
};
</script>

<style lang="scss">
@import '../../assets/css/_toolbar';

.bar-tab {
  right: 33% !important;
  left: 33% !important;
}
</style>
