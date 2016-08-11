var gulp = require('gulp')
var settings = require('./settings')
var browserify = require('browserify')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var Log = require('./log')

var options = {
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
      sourceMaps: settings.sourcemaps,
      presets: ['es2015', 'react']
    })

  if (settings.minify) b = b.transform({global: true}, 'uglifyify')

  return b
}

function logBuildError (err) {
  console.log(err.error, Object.keys(err))
  this.error([err.filename, err.codeFrame].join('\n'))
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
        .on('error', logBuildError.bind(log))
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
        verbose: settings.verbose,
        cache: {},
        packageCache: {},
        plugin: [watchify]
      }

      var b = bundle(opts)

      b
        .on('error', log.error.bind(log))
        .on('log', log.info.bind(log))
        .on('bytes', log.info.bind(log))
        .on('update', update)

      update()

      function update () {
        b.bundle()
          .on('error', logBuildError.bind(log))
          .pipe(source(file[1]))
          .pipe(gulp.dest(settings.public))
      }

      return b
    })

    return Promise.all(bs)
  }
}
