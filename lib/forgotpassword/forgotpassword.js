/**
 * Module dependencies.
 */

var page = require('page');
var FormStep1 = require('./form-view-step1');
var FormStep2 = require('./form-view-step2');
var empty = require('empty');
var request = require('superagent');

page('/forgotpassword/step1', function(ctx, next) {
  // Retrieve container
  var container = document.querySelector('section.site-content');
  // Build form view with options
  var form = FormStep1({});

  // Empty container and render form
  empty(container).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/forgotpassword/step1')
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


page('/forgotpassword/step2', function(ctx, next) {
  // Retrieve container
  var container = document.querySelector('section.site-content');
  // Build form view with options
  var form = FormStep2({});
  // Empty container and render form
  empty(container).appendChild(form.render());

  var token = ctx.querystring.substring(6);

  var verifyTokenRequest = request
  .post('/forgotpassword/verifytoken')
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
    .post('/forgotpassword/step2')
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