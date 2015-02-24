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
  var form = new ForgotView();

  // Update page's title
  title(t('forgot.question'));

  // Empty container and render form
  form.replace(o('#content'));
});


page('/forgot/reset/:token', function(ctx, next) {
  // Build form view with options
  var token = ctx.params.token;
  var form = ResetView(token);

  // Update page's title
  title(t('forgot.reset'));

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