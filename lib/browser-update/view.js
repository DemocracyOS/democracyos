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
  var view = render.dom(template);
  dom('#content').empty().append(view);
  console.log('pase por acá');
});