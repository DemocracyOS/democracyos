var mkdirp = require('mkdirp')
var settings = require('./settings')
var log = require('./log')('public')

function create (name, cb) {
  log.debug(name)
  mkdirp(settings.public, cb)
}

module.exports = function (done) {
  create(settings.public, done)
}
