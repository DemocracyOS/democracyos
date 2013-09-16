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
  log('Required in context %o', ctx);

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

citizen.optional = function(ctx, next) {
  log('Optional load in context %o', ctx);
  ctx.citizen = citizen;
  citizen.load('me');
  citizen.once('error', function(err) {
    log('Found error %s', err);
    next();
  });
  citizen.ready(next);
};

function loggedout () {
  log('logged out %s', citizen && citizen.id);
  page('/')
}