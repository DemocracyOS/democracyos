/**
 * Module dependencies.
 */

var page = require('page');
var SettingsForm = require('./view');
var empty = require('empty');
var request = require('request');
var classes = require('classes');
var citizen = require('citizen');
var title = require('title');
var t = require('t');
var o = require('query');

page('/settings', citizen.optional, function(ctx, next) {
  // Build form view with options
  var form = SettingsForm({});

  // Display content section
  classes(document.body).add("settings-page");

  // Update page's title
  title(t('Settings'));

  // Empty container and render form
  empty(o('#content')).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/settings')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {        
        return form.errors([JSON.parse(res.text).error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      title(t('Settings complete'));
      form.showSuccess();
    });
  });
});