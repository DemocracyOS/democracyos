/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

module.exports = AdminWhitelists;

/**
 * Creates `AdminUsers` view for admin
 */
function AdminWhitelists(whitelists) {
  if (!(this instanceof AdminWhitelists)) {
    return new AdminWhitelists(whitelists);
  };

  View.call(this, template, { whitelists: whitelists });
}

View(AdminWhitelists);
