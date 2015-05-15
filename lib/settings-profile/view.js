/**
 * Module dependencies.
 */

var citizen = require('citizen');
var FormView = require('form-view');
var log = require('debug')('democracyos:settings-profile');
var t = require('t');
var l10n = require('l10n');
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

  var self = this;
  this.locales = this.find('select#locale')[0];
  l10n.supported.forEach(function(language) {
    var option = document.createElement('option');
    option.value = language;
    option.innerHTML = t('settings.locale.' + language);
    self.locales.appendChild(option);
  });

  this.locales.value = citizen.locale || config.locale;
  var selected = this.find('option[value=":locale"]'.replace(':locale', this.locales.value))
  selected.attr('selected', true);
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
  var self = this;

  log('Profile updated');
  citizen.load('me');

  citizen.once('loaded', function () {
    self.find('img').attr('src', citizen.profilePicture());
    self.messages([t('settings.successfuly-updated')], 'success');

    if (citizen.locale && citizen.locale !== config.locale) {
      setTimeout(function(){
        window.location.reload();
      }, 10);
    }
  });
}

/**
 * Sanitizes form input data. This function has side effect on parameter data.
 * @param  {Object} data
 */
ProfileForm.prototype.postserialize = function(data) {
  data.firstName = sanitize(data.firstName);
  data.lastName = sanitize(data.lastName);
}

function sanitize(string) {
  return string.trim().replace(/\s+/g, ' ');
}
