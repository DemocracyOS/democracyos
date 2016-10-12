var gulp = require('gulp')
var browserify = require('browserify')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var settings = require('./settings')
var Log = require('./log')

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
      presets: ['es2015', 'react'],
      plugins: [
        'transform-class-properties',
        'syntax-class-properties'
      ]
    })

  if (settings.minify) b = b.transform({global: true}, 'uglifyify')

  return b
}

function logBuildError (err) {
  if (err.filename && err.codeFrame) {
    this.error([err.filename, err.codeFrame].join('\n'))
  } else {
    this.error(err)
  }
}

/*
 * Define tasks
 */

module.exports = function (entries) {
  return {
    build: function () {
      var log = Log('js:build')

      var bs = entries.map(function (file) {
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

      var bs = entries.map(function (file) {
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
}
