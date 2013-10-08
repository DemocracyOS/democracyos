/**
 * Module dependencies.
 */

var page = require('page');
var citizen = require('citizen');
var ForgotView = require('./forgot-view');
var ResetView = require('./reset-view');
var empty = require('empty');
var request = require('superagent');

page('/forgot', citizen.optional, function(ctx, next) {
  // If citizen is logged in
  // redirect to `/`
  if (ctx.citizen.id) return page('/');

  // Retrieve container
  var container = document.querySelector('section.site-content');
  // Build form view with options
  var form = ForgotView({});

  // Empty container and render form
  empty(container).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/forgot')
    .send(data)
    .end(function(err, res) {
     if (!res.ok) {
        return form.errors([res.error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      window.location.replace('/');
    });
  });
});


page('/forgot/reset/:token', function(ctx, next) {
  // Retrieve container
  var container = document.querySelector('section.site-content');
  // Build form view with options
  var form = ResetView({});
  // Empty container and render form
  empty(container).appendChild(form.render());

  var token = ctx.params.token;

  var verifyTokenRequest = request
  .post('/forgot/verify')
  .send({token : token})
  .end(function(err, res) {
    if (!res.ok) {
      return form.errors([res.error]);
    };
    if (err || (res.body && res.body.error)) {
      return form.errors([err || res.body.error]);
    };
  });

  form.on('submit', function(data) {
    data.token = token;
    // TODO cancel verify request if not finished
    request
    .post('/forgot/reset')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {
         return form.errors([res.error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      window.location.replace('/');
    });
  });


});