/*
 *  Module dependencies
 */

var mongoose = require('mongoose');
var config = require('lib/config');

module.exports = function(app) {

  /*
   *  Connect to mongo
   */

  mongoose.connect(config('mongoUrl'), { db: { safe: true }});

  /*
   *  Citizen Model
   */

  require('./citizen');

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
