/**
 * Module dependencies.
 */

var profile = require('./profile-template');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var regexps = require('regexps');
var request = require('request');
var citizen = require('citizen');
var events = require('events');
var render = require('render');
var empty = require('empty');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:settings-profile');

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

  this.el = render.dom(profile);

  this.events = events(this.el, this);
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(ProfileView.prototype);


/**
 * Turn on event bindings
 */

ProfileView.prototype.switchOn = function() {
  this.events.bind('submit form');
  this.on('submit', this.formsubmit.bind(this));
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
}

/**
 * Turn off event bindings
 */

ProfileView.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

ProfileView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  // Temporarily disable email submission, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  if (data.email) delete data.email;

  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.messages(errors);
    return;
  };

  // Sanitize data before submitting
  this.sanitize(data);

  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Handle `submit` event to
 * perform POST request with
 * data
 *
 * @param {Event} ev
 * @api private
 */

ProfileView.prototype.formsubmit = function(data) {
  var view = this;

  request
  .post('/settings/profile')
  .send(data)
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %s', err || res.error);
    };
    if (res.body && res.body.error) {
      return view.emit('error', res.body.error);
    };

    view.emit('success', res.body);
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

ProfileView.prototype.onerror = function(error) {
  log('Error: %o', error);
  this.messages([error]);
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
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

ProfileView.prototype.validate = function(data) {
  var errors = [];
  if (!isValidNameInput(data.firstName)) {
    errors.push(t('First name isn\'t valid'));
  };
  if (data.firstName.length > 100) { 
    errors.push(t('First name should be 100 characters or less'));
  };
  if (!isValidNameInput(data.lastName)) {
    errors.push(t('Last name isn\'t valid'));
  };
  if (data.firstName.length > 100) { 
    errors.push(t('Last name should be 100 characters or less'));
  };
  // Temporarily disable email validation, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // if (!regexps.email.test(data.email)) {
  //   errors.push(t('Email is not valid'));
  // };
  return errors;
}

/**
 * Sanitizes form input data. This function has side effect on parameter data.
 * @param  {Object} data
 */
ProfileView.prototype.sanitize = function(data) {
  data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
  data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
  // Temporarily disable email sanitization, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // data.email = data.lastName.trim();
}

function isValidNameInput(value) {
  return value && (typeof value === 'string') && (value.length > 0) && !regexps.blank.test(value) && regexps.names.test(value)
}

/**
 * Fill messages list
 *
 * @param {Array} msgs
 * @param {string} type
 * @api public
 */

ProfileView.prototype.messages = function(msgs, type) {
  var ul = o('ul.form-messages', this.el);

  if (!arguments.length) return empty(ul);

  msgs.forEach(function(m) {
    var li = document.createElement('li');
    li.innerHTML = m;
    classes(li).add(type || 'error');
    ul.appendChild(li);
  });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {ProfileView|Element}
 * @api public
 */

ProfileView.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}