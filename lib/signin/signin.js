/**
 * Module dependencies.
 */

var page = require('page');
var SigninForm = require('./view');
var classes = require('classes');
var title = require('title');
var t = require('t');
var config = require('config');
var citizen = require('citizen');
var authFacebookForm = require('auth-facebook/form');

page('/signin', externalSignin, citizen.loggedoff, authFacebookForm, function() {
  // Build signin view with options
  var form = new SigninForm();

  // Display section content
  classes(document.body).add('signin-page');

  // Update page's title
  title(t('signin.login'));

  // Render signin-page into content section
  form.replace('#content');
});

page('/signin/:token', function() {
  // Redirect to home with full page reload
  window.location = '/';
})

function externalSignin(ctx, next) {
  if (!config.signinUrl) return next();
  var url = config.signinUrl + '?returnUrl=' + encodeURI(location.href);
  window.location = url;
}
