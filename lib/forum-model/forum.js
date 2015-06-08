/**
 * Module dependencies.
 */

var page = require('page');
var Forum = require('./model');
var log = require('debug')('democracyos:forum');
var bus = require('bus');

/**
 * Instantiate and expose forum
 */

var forum = new Forum();
export default forum;

/**
 * Force forum's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

forum.required = function(ctx, next) {
  log('required at path %s', ctx.path);
  forum.load(ctx.params.forum);
  ctx.forum = forum;

  forum.once('error', onerror);
  forum.ready(function() {
    forum.off('error', onerror);
    next();
  });
}

function onerror(err) {
  return log('Found error %s', err);
}
