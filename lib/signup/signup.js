/**
 * Module dependencies.
 */

var page = require('page');
var SignupForm = require('./signup-form-view');
var EmailValidationForm = require('./email-validation-form-view');
var EmailValidationCompleteForm = require('./email-validation-complete-view');
var ResendValidationEmailForm = require('./resend-validation-email-form-view');
var empty = require('empty');
var request = require('request');
var domify = require('domify');
var classes = require('classes');
var citizen = require('citizen');
var title = require('title');
var t = require('t');
var o = require('query');

page('/signup', function(ctx, next) {
  // Build form view with options
  var form = SignupForm();

  // Display content section
  classes(document.body).add("signup-page");

  // Update page's title
  title(t('Signup'));

  // Empty container and render form
  form.replace('#content');
});

page('/signup/validate/:token', function(ctx, next) {
  // Build form view with options
  var form = EmailValidationForm(ctx.params.token);

  // Display content section
  classes(document.body).add('validate-token');

  form.replace('#content');
});

page('/signup/validated', citizen.optional, function(ctx, next) {
  // Build form view with options
  var form = EmailValidationCompleteForm();

  // Display content section
  classes(document.body).add('validation-complete');

  form.replace('#content');
});

page('/signup/resend-validation-email', function(ctx, next) {
  // Build form view with options
  var form = new ResendValidationEmailForm();

  // Display content section
  classes(document.body).add('signup-page');

  // Update page's title
  title(t('Resend validation email'));

  // Empty container and render form
  form.replace('#content');
});
