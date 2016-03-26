'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var strictify = require('strictify');
var vueify = require('vueify');
var babelify = require('babelify');

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var del = require('del');
var sass = require('gulp-sass');

var tape = require('gulp-tape');
var tapColorize = require('tap-colorize');

gulp.task('clean', function() {
  return del(['build/metavrse.js']);
});

var customOpts = {
  entries: ['./client-init'],
  debug: false
};
var opts = assign({}, watchify.args, customOpts);
var b = browserify(opts);

b.transform(strictify);
b.transform(vueify);
b.transform(babelify);
b.on('log', gutil.log);

gulp.task('test', function () {
  return gulp.src('spec/**/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});

gulp.task('watch-js', ['clean'], function() {
  var bundle = function() {
    return w.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('metavrse.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./build'));
  };

  var w = watchify(b);
  w.on('update', bundle);
  return bundle();
});

gulp.task('sass', function () {
  return gulp.src('./assets/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch-css', ['sass'], function () {
  return gulp.watch('assets/css/**/*.scss', ['sass']);
});
