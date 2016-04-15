import page from 'page';
import config from '../config/config';
import View from '../view/view';

/**
 * Page.js middleware for path
 * replacing
 *
 * @param {String} path
 * @return {Function} middleware
 * @api private
 */

function replace (path) {
  return function middleware (ctx) {
    path = path || ctx.path;
    window.location.replace(path);
  }
}

if (config.googleSignin) page('/auth/google', replace());
