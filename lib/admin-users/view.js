/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');

module.exports = AdminUsers;

/**
 * Creates `AdminUsers` view for admin
 */
function AdminUsers() {
  if (!(this instanceof AdminUsers)) {
    return new AdminUsers();
  };

  View.call(this, template);
}

View(AdminUsers);
