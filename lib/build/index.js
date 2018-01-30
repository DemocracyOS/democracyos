/**
 * Import gulp and the settings object
 */

const gulp = require('gulp')

/**
* Import main and extension
* entries bundle files
* and merge them
*/

const extEntries = require('../ext/entries')
const mainEntries = require('./entries.json')

const entries = {
  js: Object.assign({}, mainEntries.js, extEntries.js),
  css: Object.assign({}, mainEntries.css, extEntries.css)
}

/**
 * Import gulp tasks
 */

const js = require('./js')(entries.js)
const css = require('./css')(entries.css)
const assets = require('./assets')('./{lib,ext/lib}/**/assets/*')
const publicDir = require('./public')
const serve = require('./serve')
const clean = require('./clean')

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
