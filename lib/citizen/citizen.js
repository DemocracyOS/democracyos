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

citizen.load('me');

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
  if (!citizen.logged()) citizen.load('me');

  if ('unloaded' === citizen.state()) {
    setTimeout(redirect, 0);
  } else if ('loading' === citizen.state()) {
    citizen.once('error', logout);
  }

  citizen.ready(function() {
    citizen.off('error', logout);
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

  if (!citizen.logged()) citizen.load('me');
  citizen.once('error', onerror);
  citizen.ready(onready);

  function onerror(err) {
    log('Found error %s', err);
    logout();
    log('unregistered entering "%s"', ctx.path);
    next();
  }

  function onready() {
    citizen.off('error', onerror);
    log('registered entering "%s"', ctx.path);
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
    log('redirect to `/`');
    redirect('/');
  }

  function onready() {
    citizen.off('error', onerror);
    if (citizen.staff) return next();
    log('redirect to `/`')
    redirect('/');
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
  setTimeout(function() {
    page(path || '/');
  }, 0);
}

bus.on('logout', logout);

