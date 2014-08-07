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
  this.messages([t('Your password was successfuly updated')], 'success');
}