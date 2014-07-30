/*
 * Module dependencies.
 */

var t = require('t');
var domify = require('domify');
var Emitter = require('emitter');
var empty = require('empty');
var FormView = require('form-view');
var events = require('events');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var template = require('./signup-form');
var render = require('render');

/**
 * Expose SignupFormView.
 */

module.exports = SignupFormView;

/**
 * Proposal Comments view
 *
 * @return {SignupFormView} `SignupFormView` instance.
 * @api public
 */

function SignupFormView () {
  if (!(this instanceof SignupFormView)) {
    return new SignupFormView();
  };

  FormView.call(this, template);
}

/**
 * Inherit from `FormView`
 */

FormView(SignupFormView);

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

SignupFormView.prototype.onsubmit = function(ev) {
  ev.preventDefault();

  // Clean errors list
  this.errors();

  // Serialize form
  var form = this.el.querySelector('form');
  var data = serialize.object(form);

  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

SignupFormView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push(t('Password is not good enough'));
  };
  if (data.password !== data.re_password) {
    errors.push(t('Passwords do not match'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  if (!data.firstName.length) {
    errors.push(t('A firstname is required'));
  };
  if (!data.lastName.length) {
    errors.push(t('A lastname is required'));
  };
  return errors;
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

SignupFormView.prototype.errors = function(errors) {
  var ul = this.el.querySelector('ul.form-errors');

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = e;
    ul.appendChild(li);
  });
}

SignupFormView.prototype.showSuccess = function() {
  var form = this.el.querySelector('#signup-form');
  var success = this.el.querySelector('#signup-message');

  var welcomeMessage = this.el.querySelector('#signup-message h1');
  var firstName = this.el.querySelector('#signup-form #firstName');
  var lastName = this.el.querySelector('#signup-form #lastName');
  var fullname = firstName.value + ' ' + lastName.value;

  welcomeMessage.innerHTML = t("Welcome, {name}!", { name: fullname || t("Guest")})

  classes(form).add('hide');
  classes(success).remove('hide');
}
