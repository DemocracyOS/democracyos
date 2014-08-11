/*
 * Module dependencies.
 */

var FormView = require('form-view');
var page = require('page');
var submit = require('submit-form');
var template = require('./email-validation');
var t = require('t');

/**
 * Expose EmailValidationForm.
 */

module.exports = EmailValidationForm;

/**
 * Email Validation Form View
 *
 * @return {EmailValidationForm} `EmailValidationForm` instance.
 * @api public
 */

function EmailValidationForm (token, reference) {
  if (!(this instanceof EmailValidationForm)) {
    return new EmailValidationForm(token, reference);
  };

  this.reference = reference;
  var options = { token: token };
  FormView.call(this, template, options);

  submit(this.find('form')[0]);
}

/**
 * Inherit from `FormView`
 */

FormView(EmailValidationForm);

EmailValidationForm.prototype.switchOn = function() {
  this.on('success', this.bound('onsuccess'));
};

EmailValidationForm.prototype.switchOff = function() {
  this.off('success', this.bound('onsuccess'));
};

/**
 * Show success message
 */

EmailValidationForm.prototype.onsuccess = function() {
  var url = '/signup/validated';
  url += this.reference ? '?reference=' + this.reference : '';
  page(url);
}