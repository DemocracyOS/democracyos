var db = require('democracyos-db');
var config = require('lib/config');

/*
 *  Module dependencies
 */

var exports = module.exports = function(app) {

  // Initialize data models
  var connection = db.getDefaultConnection();

  require('./topic')(connection);
  require('./tag')(connection);
  require('./comment')(connection);
  require('./forum')(connection);
  require('./feed')(connection);
  require('./token')(connection);
  require('./whitelist')(connection);
  exports.User = require('./user')(connection);

  // Perform primary connection
  db.connect(config.mongoUrl);
}
