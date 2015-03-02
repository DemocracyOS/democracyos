/**
 * Module dependencies.
 */

var page = require('page');
var bus = require('bus');
var classes = require('classes');
var config = require('config');

page('*', function(ctx, next) {
  bus.emit('page:change', ctx.path);
  var body = classes(document.body);
  body.remove(/[^browser\-page]/);
  body.add(config.env);
  next();
});
