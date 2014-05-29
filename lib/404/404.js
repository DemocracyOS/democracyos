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

page('*', function () {
  var view = render.dom(template);
  empty(o('#content'))
    .appendChild(view);
  classes(o('body')).add('not-found');
});