/**
 * Module dependencies.
 */

var page = require('page');
var Citizen = require('./model');
var log = require('debug')('democracyos:citizen');
var bus = require('bus');

/**
 * Instantiate and expose citizen
 */

var citizen = module.exports = new Citizen();

/**
 * First citizen load
 */

citizen.load('me');

/**
 * Logout when logged out from server
 */

bus.on('logout', logout);

/**
 * Force citizen's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

citizen.required = function(ctx, next) {
  log('required at path %s', ctx.path);
  ctx.citizen = citizen;
  if (!citizen.logged()) citizen.load('me');

  if ('unloaded' === citizen.state()) {
    setTimeout(redirect, 0);
  } else if ('loading' === citizen.state()) {
    citizen.once('error', onerror);
  }

  citizen.ready(function() {
    citizen.off('error', onerror);
    next();
  });

  function onerror(err) {
    log('Found error %s', err);
    logout();
    redirect('/signin');
  }
};

/**
 * Load citizen's data if logged in
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

citizen.optional = function(ctx, next) {
  log('optional at path %s', ctx.path);
  ctx.citizen = citizen;

  if (!citizen.logged()) citizen.load('me');
  citizen.once('error', onerror);
  citizen.ready(onready);

  function onerror(err) {
    log('Found error %s', err);
    logout();
    log('unlogged citizen at path "%s"', ctx.path);
    next();
  }

  function onready() {
    citizen.off('error', onerror);
    log('logged citizen at path "%s"', ctx.path);
    next();
  }
};

/**
 * If staff let go middleware
 *
 * @param {Object} ctx
 * @param {Function} next
 * @api public
 */

citizen.isStaff = function isStaff(ctx, next) {
  ctx.citizen = citizen;

  if (!citizen.logged()) citizen.load('me');
  citizen.once('error', onerror);
  citizen.ready(onready);

  function onerror(err) {
    log('Found error %s', err);
    logout();
    redirect('/singin');
  }

  function onready() {
    citizen.off('error', onerror);
    if (citizen.staff) return next();
    redirect();
  }
}

/**
 * Unloads citizen instance
 *
 * @api private
 */

function logout() {
  log('logging out citizen');
  if (citizen.logged()) citizen.unload();
}

/**
 * Redirect to `path`
 *
 * @api private
 */

function redirect(path) {
  setTimeout(go, 0);

  function go() {
    log('redirect to `%s`', path);
    page(path || '/');
  }
}
