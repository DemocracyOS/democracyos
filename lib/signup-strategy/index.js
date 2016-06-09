/**
 * Module dependencies.
 */

var Batch = require('batch')
var log = require('debug')('democracyos:signup-strategy')

function SignupStrategy () {
  if (!(this instanceof SignupStrategy)) {
    return new SignupStrategy()
  }

  this.strategies = []
}

SignupStrategy.prototype.use = function (strategy) {
  this.strategies.push(strategy)

  return this
}

SignupStrategy.prototype.signup = function (user, callback) {
  var batch = new Batch()

  this.strategies.forEach(function (Strategy) {
    batch.push(new Strategy(user))
  })

  batch.end(function (err, res) {
    if (err) {
      log('Found error signing up: %s', err)
      return callback(err)
    }

    callback(null, true)
  })

  return this
}

module.exports = SignupStrategy
