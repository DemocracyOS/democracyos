/**
 * Import gulp and the settings object
 */

var gulp = require('gulp')

/**
* Import main entry bundle files
*/

var entries = require('./entries.json')

/**
 * Import gulp tasks
 */

var js = require('./js')(entries.js)
var css = require('./css')(entries.css)
var assets = require('./assets')('./{lib,ext/lib}/**/assets/*')
var publicDir = require('./public')
var serve = require('./serve')
var clean = require('./clean')

/**
 * Register tasks in gulp
 */

gulp

  /**
   * JavaScript related tasks
   */

  .task('js:build', js.build)
  .task('js:watch', js.watch)

  /**
   * CSS related tasks
   */

  .task('css:lint', css.lint)
  .task('css:build', css.build)
  .task('css:watch', ['css:build'], css.watch)

  /**
   * Copy assets (images, fonts)
   */

  .task('assets', ['public'], assets)
  .task('public', publicDir)

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
