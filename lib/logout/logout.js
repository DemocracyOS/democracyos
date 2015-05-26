/**
 * Module dependencies.
 */

var bus = require('bus');
var config = require('config');
var page = require('page');
var request = require('request');
var log = require('debug')('democracyos:logout');
var citizen = require('citizen');

page('/logout', function(ctx, next) {
  bus.emit('logout');

  setTimeout(redirect, 0);

  function redirect () {
    if (config.signinUrl) return window.location = config.signinUrl;
    page('/');
  }
});
