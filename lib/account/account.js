/**
 * Module dependencies.
 */

var page = require('page');
var AccountForm = require('./account-form-view');
var empty = require('empty');
var request = require('request');
var domify = require('domify');
var classes = require('classes');
var citizen = require('citizen');
var title = require('title');
var t = require('t');
var o = require('query');

page('/account', citizen.optional, function(ctx, next) {
  // Build form view with options
  var form = AccountForm({});

  // Display content section
  classes(document.body).add("account-page");

  // Update page's title
  title(t('Account'));

  // Empty container and render form
  empty(o('#content')).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/account')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {        
        return form.errors([JSON.parse(res.text).error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      title(t('Account complete'));
      form.showSuccess();
    });
  });
});