var db = require('democracyos-db');
var config = require('lib/config');

/*
 *  Module dependencies
 */

var exports = module.exports = function(app) {

  // Initialize data models
  var dataDb = db.getDefaultConnection();

  require('./law')(dataDb);
  require('./tag')(dataDb);
  require('./comment')(dataDb);
  require('./feed')(dataDb);
  require('./token')(dataDb);
  require('./whitelist')(dataDb);

  // Treat User model as per configuration

  var usersDb = dataDb;

  // If a separate database is configured, create a dedicated connection
  var usingSeparateUsersDb = !!(config.mongoUsersUrl && (config.mongoUsersUrl != config.mongoUrl));
  if (usingSeparateUsersDb) {
    usersDb = db.createConnection(config.mongoUsersUrl);
  }

  exports.User = require('./user')(usersDb);

  // Perform primary connection
  db.connect(config.mongoUrl);
}
