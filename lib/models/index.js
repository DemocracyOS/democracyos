var mongoose = require('mongoose')
var connReady = require('mongoose-connection-ready')
var config = require('lib/config')

mongoose.Promise = global.Promise

/*
 *  Module dependencies
 */

var exports = module.exports = function () {
  // Initialize data models
  var connection = mongoose.createConnection(config.mongoUrl)

  // Treat User model as per configuration
  var usersDb = connection

  // If a separate database is configured, create a dedicated connection
  if (config.mongoUsersUrl && (config.mongoUsersUrl !== config.mongoUrl)) {
    usersDb = mongoose.createConnection(config.mongoUsersUrl)
  }

  exports.Topic = require('./topic')(connection)
  exports.Tag = require('./tag')(connection)
  exports.Comment = require('./comment')(connection)
  exports.Forum = require('./forum')(connection)
  exports.Token = require('./token')(connection)
  exports.Whitelist = require('./whitelist')(connection)
  exports.Notification = require('./notification')(connection)
  exports.User = require('./user')(usersDb)

  exports.ready = function ready () {
    return Promise.all([
      connReady(connection),
      connReady(usersDb)
    ])
  }
}
