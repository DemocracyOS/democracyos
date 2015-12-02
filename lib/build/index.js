/**
 * Import gulp and the settings object
 */

var gulp = require('gulp');
var settings = require('./settings');

/**
 * Import gulp tasks
 */

var js = require('./js');
var css = require('./css');
var public = require('./public');
var serve = require('./serve');
var assets = require('./assets');
var clean = require('./clean');
var test = require('./test');

/**
 * Register tasks in gulp
 */

gulp

  /**
   * JavaScript related tasks
   */

  .task('js:lint', js.lint)
  .task('js:build', ['public'], js.build)
  .task('js:dist', ['public'], js.dist)
  .task('js:watch', ['public'], js.watch)

  /**
   * CSS related tasks
   */

  .task('css:lint', css.lint)
  .task('css:build', css.build)
  .task('css:dist', css.dist)
  .task('css:watch', ['css:build'], css.watch)

  /**
   * Copy assets (images, fonts)
   */

  .task('assets', ['public'], assets)
  .task('public', public)

  /**
   * Delete generated files
   */

  .task('clean', clean)

  /**
   * Start server
   */

  .task('serve', serve)

  /**
   * Bulk tasks
   */

  .task('watch', ['js:watch', 'css:watch'])
  .task('build', ['js:build', 'css:build', 'assets'])

  /**
   * Build/watch/serve
   */

  .task('bws', ['assets', 'watch', 'serve'])
  .task('default', ['build', 'serve'])
