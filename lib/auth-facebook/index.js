/**
 * Module dependencies.
 */

var routes = require('./routes')
var strategy = require('./strategy')

/**
 * Expose AuthFacebook Module
 */

module.exports = AuthFacebook

/**
 * AuthFacebook Module
 */

function AuthFacebook (app) {
  /**
   * Instantiates PassportJS midlewares
   */

  strategy(app)

  /**
   * Attach routes to parent application
   */

  app.use(routes)
}
