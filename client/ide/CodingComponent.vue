<template>
  <div id="scripting">
    <div id="scripting-header"></div>
    <div id="scripting-content"></div>
  </div>
</template>

<script>

import editor from './editor';

export default {
  name: 'CodingComponent',
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style>
#scripting {
  display: none;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

  #scripting-header {
    padding: 7px;
    width: 100%;
    background: #000;
    color: #fff;
  }

    .closeButton {
      position: absolute;
      top: 3px;
      right: 1px;
      cursor: pointer;
    }

  #scripting-content {
    width: 100%;
    height: 100%;
  }

  .CodeMirror {
    height: 100% !important;
  }
</style>
