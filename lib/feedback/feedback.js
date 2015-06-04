/**
 * Module dependencies
 */

var uservoice = require('./uservoice');
var user = require('user');

/**
 * Constructor
 */

function Feedback() {
  if (!(this instanceof Feedback)) {
    return new Feedback();
  };

  this.refresh = this.refresh.bind(this);
  this.onUser = this.onUser.bind(this);

  user.ready(this.onUser);
  uservoice();
};

Feedback.prototype.onUser = function() {
  uservoice.user();
  user.on('loaded', this.refresh);
  user.on('unloaded', this.refresh);
};

/**
 * Refreshes feedback handler
 *
 * @api private
 */
Feedback.prototype.refresh = function() {
  uservoice.user();
};

Feedback.prototype.bind = function() {
  uservoice.bind();
};
module.exports = Feedback();