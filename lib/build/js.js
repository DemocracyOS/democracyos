var gulp = require('gulp')
var settings = require('./settings')
var browserify = require('browserify')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var Log = require('./log')

var options = module.exports.options = {
  entries: [
    ['./lib/admin/boot/boot.js', 'admin.js'],
    ['./lib/site/boot/boot.js', 'site.js'],
    ['./lib/settings/boot/boot.js', 'settings.js']
  ]
}

function bundle (options) {
  var b = browserify(Object.assign({}, {
    debug: settings.sourcemaps,
    extensions: ['.md', '.markdown']
  }, options))
    .transform('jadeify')
    .transform('markdownify')
    .transform('babelify', {
      compact: settings.minify,
      presets: ['es2015']
    })

  if (settings.minify) b = b.transform({global: true}, 'uglifyify')

  return b
}

/*
 * Define tasks
 */

module.exports = {
  build: function () {
    var log = Log('js:build')

    var bs = options.entries.map(function (file) {
      var b = bundle({entries: file[0]})
        .bundle()
        .on('error', log.error.bind(log))
        .pipe(source(file[1]))

      return b.pipe(gulp.dest(settings.public))
    })

    return Promise.all(bs)
  },

  watch: function () {
    var log = Log('js:watch')

    var bs = options.entries.map(function (file) {
      var opts = {
        entries: file[0],
        debug: settings.verbose,
        cache: {},
        packageCache: {},
        plugin: [watchify]
      }

      var b = bundle(opts)

      b
        .on('error', log.error.bind(log))
        .on('log', log.info.bind(log))
        .on('bytes', log.debug.bind(log))
        .on('update', update)

      update()

      function update () {
        b.bundle().pipe(source(file[1])).pipe(gulp.dest(settings.public))
      }

      return b
    })

    return Promise.all(bs)
  }
}
