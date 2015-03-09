/*
 *  Module dependencies
 */

var exports = module.exports = function(app) {

  /*
   *  User Model
   */

  exports.User = require('./user');

  /*
   *  Law Model
   */

  require('./law');

  /**
   * Tag Model
   */

  require('./tag');

  /*
   *  Comment Model
   */

  require('./comment');

  /*
   *  Feed Model
   */

  require('./feed');

  /*
   *  Token Model
   */

  require('./token');

}
