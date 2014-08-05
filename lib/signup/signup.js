/**
 * Module dependencies.
 */

var page = require('page');
var SignupForm = require('./signup-form-view');
var EmailValidationForm = require('./email-validation-form-view');
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
  var form = EmailValidationForm({});
  var token = ctx.params.token;
  var data = {token: token};
  request
  .post('/signup/validate')
  .send(data)
  .end(function(err, res) {
    if (!res.ok) {
       return form.errors([res.error]);
    };
    if (err || (res.body && res.body.error)) {
      return form.errors([err || res.body.error]);
    };
    window.location.replace('/signup/validated');
  });
});

page('/signup/validated', citizen.optional, function(ctx, next) {
  // Build form view with options
  var form = EmailValidationForm({});
  empty(o('#content')).appendChild(form.render());

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
