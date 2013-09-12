/**
 * Module dependencies.
 */

var page = require('page');
var Citizen = require('./model');
var log = require('debug')('citizen');

/**
 * Instantiate and expose citizen
 */
var citizen = module.exports = new Citizen();

citizen.load("me");

citizen.required = function(ctx, next) {
  if ("unloaded" === citizen.state()) {
    setTimeout(loggedout, 0);
  } else if ("loading" === citizen.state()) {
    citizen.once('error', loggedout);
  }
  citizen.ready(function() {
    citizen.off('error', loggedout);
    next();
  });
};

function loggedout () {
  log('logged out %s', citizen && citizen.id);
  page('/')
}