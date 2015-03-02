/**
 * Module dependencies.
 */

var page = require('page');
var SigninForm = require('./view');
var classes = require('classes');
var title = require('title');
var t = require('t');
var config = require('config');
var jwt = require('jwt');

page('/signin', externalSignin, function(ctx, next) {
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
  var token = ctx.params.token;
  jwt.setToken(token);

  // Redirect to home with full page reload
  window.location = '/';
})

function externalSignin(ctx, next) {
  var auth = config['authPages'];
  if (!auth.signinUrl) return next();
  window.location = auth.signinUrl;
}
