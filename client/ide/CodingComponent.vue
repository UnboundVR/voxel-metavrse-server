<template>
  <div v-show="open" id="scripting">
    <div class="scripting-header">
      <span>Editing the code at {{position}}</span> <span v-if="id">({{id}})</span> <span v-else>(new)</span>
      <button v-on:click="save">Save</button>
      <div v-el:close class="closeButton" v-on:click="close"></div>
    </div>
    <div class="scripting-content" v-el:content></div>
  </div>
</template>

<script>

import editor from './editor';
import Vue from 'vue';

var codemirror;

export default {
  name: 'CodingComponent',
  data() {
    return {
      position: '',
      id: '',
      open: false
    };
  },
  methods: {
    save() {
      this.open = false;
      editor.save(codemirror.getValue());
    },
    close() {
      this.open = false;
      editor.close();
    }
  },
  ready() {
    var self = this;

    codemirror = CodeMirror(self.$els.content, {
      value: '',
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabSize: 2,
      indentUnit: 2,
      hintOptions: {
        completeSingle: false
      }
    });

    codemirror.on('change', editor.onChange);
    codemirror.setOption('theme', 'tomorrow-night-bright');

    var wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', e => {
      e.stopPropagation();
    });

    editor.on('open', data => {
      self.open = true;
      self.position = data.position.join('|');
      self.id = data.id;

      Vue.nextTick(() => {
        codemirror.setValue(data.code);
        editor.markClean();
        codemirror.focus();
      });
    });

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 32);
    svg.setAttribute('height', 32);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
    path.setAttribute('stroke', '#fff');
    svg.appendChild( path );
    this.$els.close.appendChild(svg);
  }
};
</script>

<style>
#scripting {
  display: block;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

  .scripting-header {
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

  .scripting-content {
    width: 100%;
    height: 100%;
  }

  .CodeMirror {
    height: 100% !important;
  }
</style>
