/**
 * Module dependencies.
 */

var FormView = require('form-view');
var t = require('t');
var template = require('./template');
var whitelists = require('whitelists');

/**
 * Expose WhitelistForm
 */

module.exports = WhitelistForm;

/**
 * Creates a password edit view
 */

function WhitelistForm(whitelist) {
  if (!(this instanceof WhitelistForm)) {
    return new WhitelistForm(whitelist);
  };

  this.setOptions(whitelist);
  FormView.call(this, template, this.options);
}

/**
 * Inherit from `FormView`
 */

FormView(WhitelistForm);

/**
 * Build view's `this.el`
 */

WhitelistForm.prototype.setOptions = function(whitelist) {
  this.action = '/api/whitelists/';
  if (whitelist) {
    this.action += whitelist.id;
    this.title = 'admin-whitelists-form.title.edit';
  } else {
    this.action += 'create';
    this.title = 'admin-whitelists-form.title.create';
  }

  this.options = {
    form: { title: this.title, action: this.action },
    whitelist: whitelist || { new: true }
  };
}

WhitelistForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
};

/**
 * Handle `success` event
 *
 * @api private
 */

WhitelistForm.prototype.onsuccess = function(res) {
  whitelists.fetch();
  whitelists.ready(this.bound('onsave'));
}

WhitelistForm.prototype.onsave = function() {
  this.messages([t('admin-whitelists-form.message.onsuccess')]);
}