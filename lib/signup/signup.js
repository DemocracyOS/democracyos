/**
 * Module dependencies.
 */

var page = require('page');
var Form = require('./form-view');
var empty = require('empty');
var request = require('request');
var signupComplete = require('./signup-complete');
var domify = require('domify');
var classes = require('classes');
var title = require('title');
var t = require('t');
var citizen = require('citizen');
var o = require('query');

page('/signup', function(ctx, next) {
  // Build form view with options
  var form = Form({});

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
      if (err || res.body.error) {
        return form.errors([err || res.body.error]);
      };
      window.location.replace('/signup/complete');
    });
  });
});

page('/signup/complete', citizen.optional, function(ctx, next) {
  // Empty content section and render success message
  empty(o('#content')).appendChild(domify(signupComplete({t: t, citizen: citizen })));

  // Update page's title
  title('Signup complete');
});