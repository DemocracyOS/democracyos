/**
 * Module dependencies.
 */

import bus from 'bus'
import page from 'page'
import User from './model'

var log = require('debug')('democracyos:user')
/**
 * Instantiate and expose user
 */

var user = new User()
export default user

/**
 * First user load
 */

user.load('me')

/**
 * Logout when logged out from server
 */

bus.on('logout', logout)

/**
 * Force user's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

user.required = function (ctx, next) {
  log('required at path %s', ctx.path)
  ctx.user = user
  if (!user.logged()) user.load('me')

  if (user.state() === 'unloaded') {
    setTimeout(redirect, 0)
  } else if (user.state() === 'loading') {
    user.once('error', onerror)
  }

  user.ready(function () {
    user.off('error', onerror)
    next()
  })

  function onerror (err) {
    log('Found error %s', err)
    logout()
    redirect('/signin')
  }
}

/**
 * Redirect user to home if logged in
 * continue to page if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 */

user.loggedoff = function (ctx, next) {
  log('checking if user is logged in at %s', ctx.path)

  if (!user.logged()) return next()

  log('user logged in. redirecting to home.')
  redirect('/')
}

/**
 * Load user's data if logged in
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

user.optional = function (ctx, next) {
  log('optional at path %s', ctx.path)
  ctx.user = user

  if (user.logged()) return next()

  user.load('me')
  user.once('error', onerror)
  user.ready(onready)

  function onerror (err) {
    log('Found error %s', err)
    logout()
    log('unlogged user at path "%s"', ctx.path)
    next()
  }

  function onready () {
    user.off('error', onerror)
    log('logged user at path "%s"', ctx.path)
    next()
  }
}

/**
 * Unloads user instance
 *
 * @api private
 */

function logout () {
  log('logging out user')
  if (user.state() === 'loading') return user.ready(logout)
  if (user.logged()) user.unload()
}

/**
 * Redirect to `path`
 *
 * @api private
 */

function redirect (path) {
  log('redirect to `%s`', path)
  page.redirect(path || '/')
}
