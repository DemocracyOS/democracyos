var settings = require('./settings')
var log = require('./log')('public')
var mkdirp = require('mkdirp')

function create (name, cb) {
  log.debug(name)
  mkdirp(settings.public, cb)
}

module.exports = function (done) {
  create(settings.public, done)
}
