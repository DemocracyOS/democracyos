const debug = require('debug')
const mongoose = require('mongoose')
const connReady = require('mongoose-connection-ready')
const config = require('lib/config')

const log = debug('democracyos:models')

mongoose.Promise = global.Promise

/*
 *  Module dependencies
 */

let inited = false

module.exports = exports = function models () {
  // Avoid double initialization
  if (inited) return models
  inited = true

  // Initialize data models
  const connection = mongoose.createConnection(config.mongoUrl)

  // Treat User model as per configuration
  // If a separate database is configured, create a dedicated connection
  const hasUsersDb = config.mongoUsersUrl &&
    config.mongoUsersUrl !== config.mongoUrl

  const usersDb = hasUsersDb
    ? mongoose.createConnection(config.mongoUsersUrl)
    : connection

  exports.Topic = require('./topic')(connection)
  exports.Vote = require('./vote')(connection)
  exports.Tag = require('./tag')(connection)
  exports.Comment = require('./comment')(connection)
  exports.Forum = require('./forum')(connection)
  exports.Token = require('./token')(connection)
  exports.Whitelist = require('./whitelist')(connection)
  exports.Notification = require('./notification')(connection)
  exports.User = require('./user')(usersDb)

  exports.ready = function ready () {
    log('Initializing DB connection.')

    return Promise.all([
      connReady(connection),
      connReady(usersDb)
    ])
  }

  return models
}
