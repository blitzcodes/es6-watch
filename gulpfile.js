'use strict';

var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var cache = require('gulp-cached');
var eslint = require('gulp-eslint');

var path = require('path');
var util = require('gulp-util');

var sourceFiles = require('./.es6sources.json');
var sourceDirectories = _.chain(sourceFiles).keys().map(function (dirname) {
  dirname = dirname + '**/*.js';
  return dirname; // load all the source paths, watch all js files, but only the root is comipled
}).value();
sourceDirectories.push("!**/*.es6.js");
util.log(util.colors.green('Setting watches on the following folders: ' + sourceDirectories.join(', ')));

gulp.task('js', function (done) {
  _.each(sourceFiles, function (filename, dirname) {

    browserify(path.join(dirname, filename), {debug: true})
      .transform(babelify)
      .bundle().on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(filename))
      .pipe(rename({
        suffix: '.es6'
      }))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      //.pipe(uglify())
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest(dirname));
  });
  done();
});

// Lint JS.
gulp.task('lintjs', function (done) {
  return gulp.src(sourceDirectories)
    .pipe(cache('lintjs'))
    .pipe(eslint())
    .pipe(eslint.format());
});

// Default task; start local server & watch for changes.
gulp.task('default', ['js'], function () {
  if (sourceDirectories.length) {
    gulp.watch(sourceDirectories, ['js']).on('change', logChanges);
  } else {
    util.log(util.colors.red('Please add some paths/source files to the .es6source.json to use this watcher'));
  }
});

// Default task; start local server & watch for changes.
gulp.task('link', ['js'], function () {
  if (sourceDirectories.length) {
    gulp.watch(sourceDirectories, ['js','lintjs']).on('change', logChanges);
  } else {
    util.log(util.colors.red('Please add some paths/source files to the .es6source.json to use this watcher'));
  }
});

/**
 * browserSync logging
 * @param event
 */
function logChanges(event) {
  util.log(
    util.colors.green('File ' + event.type + ': ') +
    util.colors.magenta(path.basename(event.path))
  );
}