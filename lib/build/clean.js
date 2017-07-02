var del = require('del')
var settings = require('./settings')
var log = require('./log')('clean')

module.exports = function (done) {
  del([settings.public, './node_modules'], function (err, paths) {
    paths.forEach(function (path) {
      log.info(path)
    })

    done(err)
  })
}
