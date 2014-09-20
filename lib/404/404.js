/**
 * Module dependencies.
 */

var empty = require('empty');
var o = require('dom');
var template = require('./template');
var render = require('render');
var page = require('page');
var classes = require('classes');

/**
 * Append 404 middleware
 */

page('*', function (ctx, next) {
  dom(document.body).addClass("not-found-page");
  var view = render.dom(template);
  dom('#content').empty().append(view);
});