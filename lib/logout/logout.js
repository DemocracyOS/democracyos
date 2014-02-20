/**
 * Module dependencies.
 */

var bus = require('bus');
var page = require('page');
var log = require('debug')('democracyos:logout');


module.exports = logout;

page('/logout', function(ctx, next) {
  logout();

  window.location.replace('/signin');
});

function logout () {
  // TODO: perform logout and emit event in bus
}