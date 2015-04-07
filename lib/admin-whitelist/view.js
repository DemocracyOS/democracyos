/**
 * Module dependencies.
 */


var closest = require('closest');
var confirm = require('confirmation');
var log = require('debug')('democracyos:admin-whitelist');
var request = require('request');
var t = require('t');
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
  this.bind('click', 'a.remove', this.bound('onremove'));
};

AdminWhitelists.prototype.onremove = function(ev) {
  ev.preventDefault();

  var self = this;
  var el = closest(ev.target, 'a', true);
  var id = el.getAttribute('data-id');

  confirm(t('admin-whitelist.delete-whitelist.confirmation.title'), t('admin-whitelist.delete-whitelist.confirmation.body'))
    .cancel(t('admin-whitelist.delete-whitelist.confirmation.cancel'))
    .ok(t('admin-whitelist.delete-whitelist.confirmation.ok'))
    .modal()
    .closable()
    .effect('slide')
    .focus()
    .show(onconfirmdelete);

    function onconfirmdelete() {
      request
        .del('/api/whitelists/:id'.replace(':id', id))
        .end(function (err, res) {
          if (err || !res.ok) return log('Found error %o', err || res.error);

          self.find('#whitelist-:id'.replace(':id', id)).remove();
        });
    }
};
