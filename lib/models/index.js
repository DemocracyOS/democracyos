/*
 *  Module dependencies
 */

var exports = module.exports = function(app) {

  /*
   *  User Model
   */

  exports.User = require('./user');

  /*
   *  Proposal Model
   */

  require('./proposal');

  /*
   *  Law Model
   */

  require('./law');

  /**
   * Tag Model
   */

  require('./tag');

  /*
   *  Delegation Model
   */

  require('./delegation');

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
