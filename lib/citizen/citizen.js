/**
 * Module dependencies.
 */

var page = require('page');
var Citizen = require('./model');
var log = require('debug')('democracyos:citizen');

/**
 * Instantiate and expose citizen
 */

var citizen = module.exports = new Citizen();

citizen.load("me");

/**
 * Force citizen's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

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

/**
 * Load citizen's data if logged in
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

citizen.optional = function(ctx, next) {
  ctx.citizen = citizen;
  citizen.load('me');
  citizen.once('error', function(err) {
    log('Found error %s', err);
    log('unregistered entering "%s"', ctx.path);
    next();
  });
  citizen.ready(function() {
    log('registered entering "%s"', ctx.path);
    next();
  });
};

/**
 * If staff let go middleware
 *
 * @param {Object} ctx
 * @param {Function} next
 * @api public
 */

citizen.isStaff = function isStaff(ctx, next) {
  citizen.ready(function onready() {
    if (citizen.staff) return next();
    page('/');
  });
}

/**
 * Log user logged out and redirect to '/'
 *
 * @api private
 */

function loggedout () {
  log('logged out %s', citizen && citizen.id);
  page('/')
}