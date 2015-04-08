/**
 * Module dependencies.
 */


var List = require('list.js');
var log = require('debug')('democracyos:admin-whitelist');
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

AdminWhitelists.prototype.switchOn = function() {
  this.list = new List('whitelists-wrapper', { valueNames: ['whitelist-title'] });
}
