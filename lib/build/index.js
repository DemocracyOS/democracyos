/**
 * Import gulp and the settings object
 */

var gulp = require('gulp')

/**
* Import main and extension
* entries bundle files
* and merge them
*/

var mainEntries = require('./entries.json')
var extEntries = require('lib/ext/entries.js')

function mergeEntries (ext, main, type) {
  var extNames = ext[type].map(function (en) { return en[1] })
  return main[type].map(function (mainEntry) {
    var entryMatch = extNames.indexOf(mainEntry[1])
    if (~entryMatch) {
      var entryOverwrite = ext[type][entryMatch]
      ext[type].splice(entryMatch, 1)
      extNames.splice(entryMatch, 1)
      return entryOverwrite
    }
    return mainEntry
  }).concat(ext[type])
}

var entries = {
  js: mergeEntries(extEntries, mainEntries, 'js'),
  css: mergeEntries(extEntries, mainEntries, 'css')
}

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
