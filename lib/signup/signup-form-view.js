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
  this.on('success', this.bound('showSuccess'));
}

SignupFormView.prototype.switchOff = function() {
  this.off('success', this.bound('showSuccess'));
};

/**
 * Inherit from `FormView`
 */

FormView(SignupFormView);

/**
 * Show success message
 */

SignupFormView.prototype.showSuccess = function() {
  var form = this.el.find('#signup-form');
  var success = this.el.find('#signup-message');

  var welcomeMessage = this.el.find('#signup-message h1');
  var firstName = this.el.find('#signup-form #firstName');
  var lastName = this.el.find('#signup-form #lastName');
  var fullname = firstName.value() + ' ' + lastName.value();

  var message = t("Welcome, {name}!", { name: fullname || t("Guest")});
  welcomeMessage.html(message);

  form.addClass('hide');
  success.removeClass('hide');
}
