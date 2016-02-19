var crosshair = document.getElementById('crosshair');
var container = document.getElementById('scripting');
var content = document.getElementById('scripting-content');
var header = document.getElementById('scripting-header');
var toolbar = document.getElementById('toolbar');
var userInfo = document.getElementById('userInfo');

var closeCodeWindow = function() {
  container.style.display = 'none';
  crosshair.style.display = 'block';
  toolbar.style.display = 'block';
  userInfo.style.display = 'block';
  content.innerHTML = '';
  header.innerHTML = '';
};

var openCodeWindow = function(codeWindowTitle, initialCode) {
  container.style.display = 'block';
  crosshair.style.display = 'none';
  toolbar.style.display = 'none';
  userInfo.style.display = 'none';

  var title = document.createElement('span');
  title.innerHTML = codeWindowTitle;
  header.appendChild(title);

  var codemirror = CodeMirror(content, {
    value: initialCode,
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

  var dirty = false;
  codemirror.on('change', function() {
    dirty = true;
  });

  codemirror.setOption('theme', 'tomorrow-night-bright');
  codemirror.focus();
  document.exitPointerLock();

  var wrapper = codemirror.getWrapperElement();
  wrapper.addEventListener('keydown', function (event) {
    event.stopPropagation();
  });

  var closeButton = (function () {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 32);
    svg.setAttribute('height', 32);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
    path.setAttribute('stroke', '#fff');
    svg.appendChild( path );

    var closeButton = document.createElement('div');
    closeButton.appendChild(svg);
    closeButton.className = 'closeButton';

    return closeButton;
  })();

  var saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save';

  header.appendChild(closeButton);

  closeButton.onclick = function() {
    if(!dirty || confirm('Exit without saving?')) {
      closeCodeWindow();
    }
  };

  header.appendChild(saveButton);

  return new Promise(function(resolve, reject) {
    saveButton.onclick = function() {
      resolve(codemirror.getValue());
      closeCodeWindow();
    }
  });
};

module.exports = {
  open: openCodeWindow
};
