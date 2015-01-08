/*
 *  Module dependencies
 */

module.exports = function(app) {

  /*
   *  Citizen Model
   */

  require('lib/user-model');

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
