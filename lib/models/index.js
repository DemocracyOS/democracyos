/*
 *  Module dependencies
 */
var mongoose = require('mongoose');

module.exports = function(app) {
  /*
   *  Connect to mongo
   */
  mongoose.connect(app.get('mongoUrl'), { db: { safe: true }});

  /*
   *  Citizen Model
   */
  require('./citizen');

  /*
   *  Proposal Model
   */
  require('./proposal');

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

}