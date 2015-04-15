/**
 * Module dependencies.
 */

var bus = require('bus');
var config = require('config');
var page = require('page');
var request = require('request');
var log = require('debug')('democracyos:logout');
var citizen = require('citizen');

module.exports = logout;

page('/logout', logout, function(ctx, next) {
  bus.emit('logout');

  setTimeout(redirect, 0);

  function redirect () {
    if (config['signin url']) return window.location = config['signin url'];
    page('/signin');
  }
});

function logout (ctx, next) {
  request
    .post('/logout')
    .end(function (err, res) {
      if (err || !res.ok) log('Logout error %s', err || res.error);

      next();
    })
}
