import Forum from './model';
import Log from 'debug';

let log = new Log('democracyos:forum');

let forums = {};

/**
 * Force forum's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

export function required (ctx, next) {
  log('required at path %s', ctx.path);

  let name = ctx.params.forum;

  if (forums[name]) {
    ctx.forum = forums[name];
    return next();
  }

  let forum = forums[name] = new Forum(name);

  forum.load();
  ctx.forum = forum;

  forum.once('error', onerror);
  forum.ready(function() {
    forum.off('error', onerror);
    next();
  });
}

function onerror (err) {
  return log('Found error %s', err);
}
