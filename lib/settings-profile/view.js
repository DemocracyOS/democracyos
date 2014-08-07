/**
 * Module dependencies.
 */

var citizen = require('citizen');
var FormView = require('form-view');
var log = require('debug')('democracyos:settings-profile');
var t = require('t');
var template = require('./template');

/**
 * Expose ProfileView
 */

module.exports = ProfileView;

/**
 * Creates a profile edit view
 */

function ProfileView() {
  if (!(this instanceof ProfileView)) {
    return new ProfileView();
  };

  FormView.call(this, template);
}

/**
 * Mixin with `Emitter`
 */

FormView(ProfileView);


/**
 * Turn on event bindings
 */

ProfileView.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
}

/**
 * Turn off event bindings
 */

ProfileView.prototype.switchOff = function() {
  this.off();
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

ProfileView.prototype.onsuccess = function() {
  log('Profile updated');
  citizen.load('me');
  this.messages([t('Your profile was successfuly updated')], 'success');
}

/**
 * Sanitizes form input data. This function has side effect on parameter data.
 * @param  {Object} data
 */
ProfileView.prototype.postserialize = function(data) {
  data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
  data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
}