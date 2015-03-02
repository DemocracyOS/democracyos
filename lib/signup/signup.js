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
var qs = require('querystring');
var title = require('title');
var t = require('t')
var config = require('config');

function parse(ctx, next) {
  ctx.query = qs.parse(ctx.querystring);
  next();
}

page('/signup', externalSignup, parse, function(ctx, next) {
  // Build form view with options
  var reference = ctx.query.reference;
  var form = SignupForm(reference);

  // Display content section
  classes(document.body).add('signup-page');

  // Update page's title
  title(t('signin.signup'));

  // Empty container and render form
  form.replace('#content');
});

page('/signup/validate/:token', externalSignup, parse, function(ctx, next) {
  // Build form view with options
  var form = EmailValidationForm(ctx.params.token, ctx.query.reference);

  // Display content section
  classes(document.body).add('validate-token');

  form.replace('#content');
});

page('/signup/validated', externalSignup, citizen.required, parse, function(ctx, next) {
  // Build form view with options
  var form = EmailValidationCompleteForm(ctx.query.reference);

  // Display content section
  classes(document.body).add('validation-complete');

  form.replace('#content');

  if (ctx.query.reference) {
    setTimeout(function () {
      page('/law/' + ctx.query.reference);
    }, 5000);
  }
});

page('/signup/resend-validation-email', externalSignup, function(ctx, next) {
  // Build form view with options
  var form = new ResendValidationEmailForm();

  // Display content section
  classes(document.body).add('signup-page');

  // Update page's title
  title(t('signup.resend-validation-email'));

  // Empty container and render form
  form.replace('#content');
});

function externalSignup(ctx, next) {
  var auth = config['authPages'];
  if (!auth.signupUrl) return next();
  window.location = auth.signupUrl;
}