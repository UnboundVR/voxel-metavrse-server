import Vue from 'vue';
import CodingComponent from './CodingComponent.vue';
import editor from './editor';

export default {
  init() {
    Vue.component('coding-component', CodingComponent);
  },
  open: editor.open
};
