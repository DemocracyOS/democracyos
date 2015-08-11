var config = require('config');
var t = require('t');
var cookie = require('cookie');
var title = require('title');
var View = require('view');
var template = require('./template');
var classes = require('classes');

module.exports = function form (ctx, next) {
  if (!config.facebookSignin) return next();

  var flashMessage = cookie('flash-message');

  if (flashMessage) {
    flashMessage = JSON.parse(flashMessage);
    cookie('flash-message', null);
  }

  // Build signin view with options
  var view = new View(template, { flashMessage: flashMessage });

  // Display section content
  classes(document.body).add('auth-facebook-form-page');

  // Update page's title
  title(t('signin.login'));

  // Render signin-page into content section
  view.replace('#content');
}