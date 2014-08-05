/*
 * Module dependencies.
 */

var t = require('t');
var domify = require('domify');
var Emitter = require('emitter');
var empty = require('empty');
var FormView = require('form-view');
var events = require('events');
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

SignupFormView.prototype.switchOn = function() {
  this.on('success', this.bound('showSuccess'));
};

SignupFormView.prototype.switchOff = function() {
  this.off('success', this.bound('showSuccess'));
};

/**
 * Show success message
 */

SignupFormView.prototype.showSuccess = function() {
  var form = this.find('#signup-form');
  var success = this.find('#signup-message');

  var welcomeMessage = this.find('#signup-message h1');
  var firstName = this.get('firstName');
  var lastName = this.get('lastName');
  var fullname = firstName + ' ' + lastName;

  var message = t("Welcome, {name}!", { name: fullname || t("Guest")});
  welcomeMessage.html(message);

  form.addClass('hide');
  success.removeClass('hide');
}
