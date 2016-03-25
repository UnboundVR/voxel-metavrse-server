import Vue from 'vue';
import CodingComponent from './CodingComponent.vue';
import editor from './editor';

export default {
  init: function() {
    Vue.component('coding-component', CodingComponent);
  },
  open: editor.open
};
