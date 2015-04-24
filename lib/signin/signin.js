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

page('/signin', facebookSignin, externalSignin, citizen.loggedoff, function(ctx, next) {
  // Build signin view with options
  var form = new SigninForm();

  // Display section content
  classes(document.body).add("signin-page");

  // Update page's title
  title(t('signin.login'));

  // Render signin-page into content section
  form.replace('#content');
});

page('/signin/:token', function(ctx, next) {
  // Redirect to home with full page reload
  window.location = '/';
})

function facebookSignin(ctx, next) {
  if (!config['facebook signin']) return next();
  page('/auth/facebook');
}

function externalSignin(ctx, next) {
  if (!config['signin url']) return next();
  var url = config['signin url'] + '?returnUrl=' + encodeURI(location.href);
  window.location = url;
}
