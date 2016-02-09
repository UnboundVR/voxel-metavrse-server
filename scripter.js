module.exports = function(position) {
  var crosshair = document.getElementById('crosshair');
  var container = document.getElementById('scripting');
  var content = document.getElementById('scripting-content');
  var header = document.getElementById('scripting-header');
  var title = document.getElementById('scripting-title');
  title.innerHTML = 'Editing the code of the voxel at ' + position;

  container.style.display = 'block';
  crosshair.style.display = 'none';

  var codemirror = CodeMirror(content, {
    value: 'function myScript(){return 100;}\n',
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

  header.appendChild(closeButton);
  closeButton.onclick = function() {
    container.style.display = 'none';
    crosshair.style.display = 'block';
    content.innerHTML = '';
  };
};
