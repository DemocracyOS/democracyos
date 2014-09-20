/**
 * Module dependencies.
 */

var citizen = require('citizen');
var FormView = require('form-view');
var log = require('debug')('democracyos:settings-profile');
var t = require('t');
var template = require('./template');

/**
 * Expose ProfileForm
 */

module.exports = ProfileForm;

/**
 * Creates a profile edit view
 */

function ProfileForm() {
  if (!(this instanceof ProfileForm)) {
    return new ProfileForm();
  };

  FormView.call(this, template);
}

/**
 * Mixin with `Emitter`
 */

FormView(ProfileForm);


/**
 * Turn on event bindings
 */

ProfileForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
}

/**
 * Turn off event bindings
 */

ProfileForm.prototype.switchOff = function() {
  this.off();
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

ProfileForm.prototype.onsuccess = function() {
  log('Profile updated');
  citizen.load('me');
  var self = this;
  citizen.once('loaded', function () {
    self.find('img').attr('src', citizen.profilePicture());
  });
  this.messages([t('Your profile was successfuly updated')], 'success');
}

/**
 * Sanitizes form input data. This function has side effect on parameter data.
 * @param  {Object} data
 */
ProfileForm.prototype.postserialize = function(data) {
  data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
  data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
}