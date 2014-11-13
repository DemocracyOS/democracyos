/*
 * Module dependencies.
 */

var View = require('view');
var template = require('./email-validation-complete');
var t = require('t');

/**
 * Expose EmailValidationCompleteForm.
 */

module.exports = EmailValidationCompleteForm;

/**
 * Email Validation Form View
 *
 * @return {EmailValidationCompleteForm} `EmailValidationCompleteForm` instance.
 * @api public
 */

function EmailValidationCompleteForm (reference) {
  if (!(this instanceof EmailValidationCompleteForm)) {
    return new EmailValidationCompleteForm(reference);
  };

  View.call(this, template, { reference: reference });
}

/**
 * Inherit from `View`
 */

View(EmailValidationCompleteForm);