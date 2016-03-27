import ToolbarComponent from './ToolbarComponent.vue';
import Vue from 'vue';
import service from './service';

export default {
  init() {
    service.init();
    Vue.component('toolbar-component', ToolbarComponent);
  },
  getSelected() {
    return service.getSelected();
  }
};
