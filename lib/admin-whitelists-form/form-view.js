/**
 * Module dependencies.
 */

var FormView = require('form-view');
var page = require('page');
var request = require('request');
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

  this.whitelist = whitelist;
  this.setOptions();
  FormView.call(this, template, this.options);
}

/**
 * Inherit from `FormView`
 */

FormView(WhitelistForm);

/**
 * Build view's `this.el`
 */

WhitelistForm.prototype.setOptions = function() {
  this.action = '/api/whitelists/';
  if (this.whitelist) {
    this.action += this.whitelist.id;
    this.title = 'admin-whitelists-form.title.edit';
  } else {
    this.action += 'create';
    this.title = 'admin-whitelists-form.title.create';
  }

  this.options = {
    form: { title: this.title, action: this.action },
    whitelist: this.whitelist || { new: true }
  };
}

WhitelistForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
  this.bind('click', '.btn-delete', this.bound('ondelete'));
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

WhitelistForm.prototype.ondelete = function() {
  request
    .del('/api/whitelists/:id'.replace(':id', this.whitelist.id))
    .end(function (err, res) {
      if (err || !res.ok) {
        this.errors([err || res.text]);
      }

      whitelists.fetch();
      page('/admin/users')
    })
}