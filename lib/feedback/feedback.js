var uservoice = require('./uservoice');
var citizen = require('citizen');

/**
 * Constructor
 */

function Feedback() {
  if (!(this instanceof Feedback)) {
    return new Feedback();
  };

  this.refresh = this.refresh.bind(this);
  this.onCitizen = this.onCitizen.bind(this);

  citizen.ready(this.onCitizen);
  uservoice();
};

Feedback.prototype.onCitizen = function() {
  uservoice.user();
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.refresh);
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