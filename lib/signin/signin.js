/**
 * Module dependencies.
 */

var page = require('page');
var SigninForm = require('./view');
var classes = require('classes');
var title = require('title');
var t = require('t');
var config = require('config');

page('/signin', externalSignin, function(ctx, next) {
  // Build signin view with options
  var form = new SigninForm();

  // Display section content
  classes(document.body).add("signin-page");

  // Update page's title
  title(t('Login'));

  // Render signin-page into content section
  form.replace('#content');
});

function externalSignin(ctx, next) {
  var auth = config['authPages'];
  if (!auth.useExternal) return next();
  window.location = auth.signinUrl;
}