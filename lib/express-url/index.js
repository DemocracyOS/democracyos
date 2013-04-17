/**
 * Module dependencies.
 */

var path = require('path');

/**
 * Expose URL binder
 */
module.exports = URL;

/**
 * Binds `Express URL` middleware to
 * specified or current scope `Express App`
 *
 * @param {ExpressApplication} app Express application instance
 * @return {Function} `Express` formed middleware
 * @api public
 */
function URL(app) {
  return middleware.bind(app || this);
}

/**
 * Middleware which adds a View `helper`
 * to any response object for building up
 * relative routes
 *
 * @param {ExpressRequest} req `Express Request` instance
 * @param {ExpressResponse} res `Express Response` instance
 * @param {Function} next `Express` formed middleware
 * @api private
 */

function middleware(req, res, next) {
  var app = this;

  // add simple uri builder function on
  // response locals variables
  res.locals({
    url: function(uri) {
      return path.join(app.route, uri);
    }
  });

  // call next middleware
  next();
}