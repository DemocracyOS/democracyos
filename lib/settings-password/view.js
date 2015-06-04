/**
 * Module dependencies.
 */

var template = require('./template');
var FormView = require('form-view')
var t = require('t');
var log = require('debug')('democracyos:settings-password');

/**
 * Expose PasswordView
 */

module.exports = PasswordView;

/**
 * Creates a password edit view
 */

function PasswordView() {
  if (!(this instanceof PasswordView)) {
    return new PasswordView();
  };

  FormView.call(this, template);
}

/**
 * Inherit from `FormView`
 */

FormView(PasswordView);


/**
 * Turn on event bindings
 */

PasswordView.prototype.switchOn = function() {
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this))
}

/**
 * Turn off event bindings
 */

PasswordView.prototype.switchOff = function() {
  this.off();
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

PasswordView.prototype.onsuccess = function() {
  log('Password updated');
  this.messages([t('settings.password-updated')], 'success');
}

/**
 * Handle current password is incorrect
 */

PasswordView.prototype.onerror = function(response) {
  if (403 == response.status) {
    this.messages([t('settings.password-invalid')], 'error')
  }
}
