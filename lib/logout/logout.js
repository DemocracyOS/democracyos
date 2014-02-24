/**
 * Module dependencies.
 */

var bus = require('bus');
var page = require('page');
var request = require('request');
var log = require('debug')('democracyos:logout');


module.exports = logout;

page('/logout', logout, function(ctx, next) {
  bus.emit('logout');

  setTimeout(redirect, 0);

  function redirect () {
    page('/signin');
  }
});

function logout (ctx, next) {
  request
    .post('/logout')
    .end(function (err, res) {
      if (err || !res.ok) log('Logout error %s', err || res.error);
    })

  next();
}