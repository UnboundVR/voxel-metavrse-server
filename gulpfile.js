'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var strictify = require('strictify');
var stringify = require('stringify');

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var del = require('del');

gulp.task('clean', function() {
  return del(['build/metavrse.js']);
});

var customOpts = {
  entries: ['./client-init'],
  debug: false
};
var opts = assign({}, watchify.args, customOpts);
var b = browserify(opts);

b.transform(stringify({
  extensions: ['.html', '.css'],
  minify: true,
  minifier: {
    extensions: ['.html', '.css'],
  }
}));

b.transform(strictify);
b.on('log', gutil.log);

gulp.task('default', ['clean'], function() {
  var bundle = function() {
    return w.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('metavrse.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./build'));
  }

  var w = watchify(b);
  w.on('update', bundle);
  return bundle();
});
