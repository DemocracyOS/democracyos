/**
 * Module dependencies.
 */

var settings = require('./settings-container');
var Password = require('settings-password');
var Profile = require('settings-profile');
var Notifications = require('settings-notifications');
var citizen = require('citizen');
var render = require('render');
var title = require('title');
var page = require('page');
var o = require('dom');

page("/settings/:page?", valid, citizen.required, function(ctx, next) {
  if (!ctx.valid) {
    return next();
  }
  var page = ctx.params.page || "profile";
  var container = o(render.dom(settings));
  var content = o('.settings-content', container);

  var profile = new Profile;
  var password = new Password;
  var notifications = new Notifications;

  // prepare wrapper and container
  o('#content').empty().append(container);

  // set active section on sidebar
  if (o('.active', container)) {
    o('.active', container).removeClass('active');
  };

  o('[href="/settings/' + page + '"]', container).addClass('active');

  // Set page's title
  title(o('[href="/settings/' + page + '"]').html());

  // render all settings pages
  profile.appendTo(content);
  password.appendTo(content);
  notifications.appendTo(content);

  // Display current settings page
  o("#" + page + "-wrapper", container).removeClass('hide');
});

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  var page = ctx.params.page || "profile";
  var valid = ['profile', 'password', 'notifications'];
  return ctx.valid = ~valid.indexOf(page), next();
}