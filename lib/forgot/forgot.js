/**
 * Module dependencies.
 */

var page = require('page');
var citizen = require('citizen');
var ForgotView = require('./forgot-view');
var ResetView = require('./reset-view');
var empty = require('empty');
var request = require('superagent');
var o = document.querySelector.bind(document);

page('/forgot', citizen.optional, function(ctx, next) {
  // If citizen is logged in
  // redirect to `/`
  if (ctx.citizen.id) return page('/');

  // Build form view with options
  var form = ForgotView({});

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
  var form = ResetView({});
  var token = ctx.params.token;

  var verifyTokenRequest = request
  .post('/forgot/verify')
  .send({token : token})
  .end(function(err, res) {
    // Empty container and render form
    empty(o('#content')).appendChild(form.render());
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