import Forum from './model';
import Log from 'debug';

let log = new Log('democracyos:forum');

let forums = {};

/**
 * Load forum from ctx.params.forum
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

export function loadForumFromParams (ctx, next) {
  log('required at path %s', ctx.path);

  let name = ctx.params.forum;

  if (forums[name]) {
    ctx.forum = forums[name];
    return next();
  }

  let forum = forums[name] = new Forum(name);

  ctx.forum = forum;

  forum.load()
    .then(next)
    .catch(onerror);
}

function onerror (err) {
  return log('Found error %s', err);
}
