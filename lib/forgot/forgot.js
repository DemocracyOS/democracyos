/**
 * Module dependencies.
 */

var page = require('page');
var citizen = require('citizen');
var ForgotView = require('./forgot-view');
var ResetView = require('./reset-view');
var title = require('title');
var empty = require('empty');
var request = require('request');
var t = require('t');
var o = require('query');

page('/forgot', citizen.optional, function(ctx, next) {
  // If citizen is logged in
  // redirect to `/`
  if (ctx.citizen.id) return page('/');

  // Build form view with options
  var form = ForgotView({});

  // Update page's title
  title(t('Forgot Password?'));

  // Empty container and render form
  empty(o('#content')).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/forgot')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {        
        return form.errors([JSON.parse(res.text).error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      form.showSuccess();
    });
  });
});


page('/forgot/reset/:token', function(ctx, next) {
  // Build form view with options
  var token = ctx.params.token;
  var form = ResetView(token);

  // Update page's title
  title(t('Reset Password!'));

  request
    .post('/forgot/verify')
    .send({token : token})
    .end(function(err, res) {
      form.replace(o('#content'));
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      if (!res.ok) {
        return form.errors([res.error]);
      };
    });
});