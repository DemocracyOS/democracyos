'use strict'

const gulp = require('gulp')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')
const settings = require('./settings')
const newLog = require('./log')

function bundle (options) {
  let b = browserify(Object.assign({}, {
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

  if (settings.minify) b = b.transform({ global: true }, 'uglifyify')

  return b
}

function logBuildError (err) {
  if (err.filename && err.codeFrame) {
    this.error(err.message)
    this.error([err.filename, err.codeFrame].join('\n'))
  } else {
    this.error(err)
  }
}

/*
 * Define tasks
 */

module.exports = function buildJs (entries) {
  return {
    build: function () {
      const log = newLog('js:build')

      const bs = Object.keys(entries).map(function (target) {
        const b = bundle({ entries: entries[target] })
          .bundle()
          .on('error', logBuildError.bind(log))
          .pipe(source(target))

        return b.pipe(gulp.dest(settings.public))
      })

      return Promise.all(bs)
    },

    watch: function () {
      const log = newLog('js:watch')

      const bs = Object.keys(entries).map(function (target) {
        const opts = {
          entries: entries[target],
          debug: settings.verbose,
          verbose: settings.verbose,
          cache: {},
          packageCache: {},
          plugin: [watchify]
        }

        const b = bundle(opts)

        b
          .on('error', log.error.bind(log))
          .on('log', log.info.bind(log))
          .on('bytes', log.info.bind(log))
          .on('update', update)

        update()

        function update () {
          b.bundle()
            .on('error', logBuildError.bind(log))
            .pipe(source(target))
            .pipe(gulp.dest(settings.public))
        }

        return b
      })

      return Promise.all(bs)
    }
  }
}
