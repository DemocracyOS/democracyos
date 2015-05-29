/**
 * Module dependencies.
 */

var page = require('page');
var User = require('./model');
var log = require('debug')('democracyos:user');
var bus = require('bus');

/**
 * Instantiate and expose user
 */

var user = new User();
export default user;

/**
 * First user load
 */

user.load('me');

/**
 * Logout when logged out from server
 */

bus.on('logout', logout);

/**
 * Force user's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

user.required = function(ctx, next) {
  log('required at path %s', ctx.path);
  ctx.user = user;
  if (!user.logged()) user.load('me');

  if ('unloaded' === user.state()) {
    setTimeout(redirect, 0);
  } else if ('loading' === user.state()) {
    user.once('error', onerror);
  }

  user.ready(function() {
    user.off('error', onerror);
    next();
  });

  function onerror(err) {
    log('Found error %s', err);
    logout(function (err) {
      if (!err) redirect('/signin');
    });
  }
};

/**
 * Redirect user to home if logged in
 * continue to page if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 */

user.loggedoff = function(ctx, next) {
  log('checking if user is logged in at %s', ctx.path);

  next();

  user.ready(function() {
    log('user logged in. redirecting to home.');
    redirect('/');
  });
}

/**
 * Load user's data if logged in
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

user.optional = function(ctx, next) {
  log('optional at path %s', ctx.path);
  ctx.user = user;

  if (user.logged()) return next();

  user.load('me');
  user.once('error', onerror);
  user.ready(onready);

  function onerror(err) {
    log('Found error %s', err);
    logout(function (err) {
      if (err) return log('error trying to logout: %s', err), next(err);
      log('unlogged user at path "%s"', ctx.path);
      next();
    });
  }

  function onready() {
    user.off('error', onerror);
    log('logged user at path "%s"', ctx.path);
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

user.isStaff = function isStaff(ctx, next) {
  ctx.user = user;

  if (!user.logged()) user.load('me');
  user.once('error', onerror);
  user.ready(onready);

  function onerror(err) {
    log('Found error %s', err);
    logout(function (err) {
      if (err) return log('error trying to logout: %s', err);
      redirect('/singin');
    });
  }

  function onready() {
    user.off('error', onerror);
    if (user.staff) return next();
    redirect();
  }
}

/**
 * Unloads user instance
 *
 * @api private
 */

function logout(cb) {
  log('logging out user');
  if (user.logged()) user.unload(cb);
  else cb();
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
