var uservoice = require('./uservoice');
var citizen = require('citizen');

module.exports = Feedback();

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
};

Feedback.prototype.onCitizen = function() {
  uservoice();
  // citizen.on('loaded', this.refresh);
  // citizen.on('unloaded', this.refresh);
};

/**
 * Refreshes feedback handler
 *
 * @api private
 */
Feedback.prototype.refresh = function() {
  uservoice();
};