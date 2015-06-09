import Forum from './model';
import Log from 'debug';

let log = new Log('democracyos:forum');
let forum = new Forum();

export default forum;

/**
 * Force forum's data if logged in
 * or redirect to '/' if not
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

forum.required = function required (ctx, next) {
  log('required at path %s', ctx.path);
  forum.load(ctx.params.forum);
  ctx.forum = forum;

  forum.once('error', onerror);
  forum.ready(function() {
    forum.off('error', onerror);
    next();
  });
};

function onerror(err) {
  return log('Found error %s', err);
}
