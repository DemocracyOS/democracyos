/**
 * Module dependencies.
 */

var empty = require('empty');
var o = require('query');
var template = require('./template');
var render = require('render');
var page = require('page');
var classes = require('classes');

/**
 * Append 404 middleware
 */

page('*', function (ctx, next) {
  page.stop();
  classes(document.body).add("not-found-page");
  var view = render.dom(template);
  empty(o('body')).appendChild(view);
});