var settings = require('./settings')
var log = require('./log')('clean')
var del = require('del')

module.exports = function (done) {
  del([settings.public, './node_modules'], function (err, paths) {
    paths.forEach(function (path) {
      log.info(path)
    })

    done(err)
  })
}
