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

page('*', function page404(ctx, next) {
  o(document.body).addClass('not-found-page');
  var view = render.dom(template);
  o('#content').empty().append(view);
});