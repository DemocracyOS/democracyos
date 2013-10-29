/**
 * Module dependencies.
 */

var page = require('page');
var SignupForm = require('./signup-form-view');
var EmailValidationForm = require('./email-validation-form-view');
var empty = require('empty');
var request = require('request');
var domify = require('domify');
var classes = require('classes');
var title = require('title');
var t = require('t');
var citizen = require('citizen');
var o = require('query');

page('/signup', function(ctx, next) {
  // Build form view with options
  var form = SignupForm({});

  // Display content section
  classes(document.body).add("signup-page");

  // Update page's title
  title('Signup');

  // Empty container and render form
  empty(o('#content')).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/signup')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {        
        return form.errors([JSON.parse(res.text).error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      title('Signup complete');
      form.showSuccess();
    });
  });
});

page('/signup/validate/:token', function(ctx, next) {
  // Build form view with options
  var form = SignupForm({});
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

