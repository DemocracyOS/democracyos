/**
 * Module dependencies.
 */

var bus = require('bus');
var page = require('page');
var log = require('debug')('democracyos:logout');


module.exports = logout;

page('/logout', function(ctx, next) {
  window.location.replace(ctx.path);
});

function logout () {
  // TODO: perform logout and emit event in bus
}