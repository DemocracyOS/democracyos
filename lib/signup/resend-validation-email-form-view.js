/*
 * Module dependencies.
 */

var FormView = require('form-view');
var t = require('t');
var template = require('./resend-validation-email-form');
var title = require('title');

/**
 * Expose ResendValidationEmailForm.
 */

module.exports = ResendValidationEmailForm;

/**
 * Proposal Comments view
 *
 * @return {ResendValidationEmailForm} `ResendValidationEmailForm` instance.
 * @api public
 */

function ResendValidationEmailForm () {
  if (!(this instanceof ResendValidationEmailForm)) {
    return new ResendValidationEmailForm();
  };

  FormView.call(this, template);
}

/**
 * Inherit from `FormView`
 */

FormView(ResendValidationEmailForm);

ResendValidationEmailForm.prototype.switchOn = function() {
  this.on('success', this.bound('showSuccess'));
};

ResendValidationEmailForm.prototype.switchOff = function() {
  this.off('success', this.bound('showSuccess'));
};

/**
 * Show success message
 */

 ResendValidationEmailForm.prototype.showSuccess = function() {
  var form = this.find('#resend-form');
  var success = this.find('#resend-message');
  title(t('Resend validation email complete'));
  form.addClass('hide');
  success.removeClass('hide');
}