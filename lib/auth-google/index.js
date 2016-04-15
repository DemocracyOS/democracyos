/**
 * Module dependencies.
 */

var routes = require('./routes');
var strategy = require('./strategy');

/**
 * Expose AuthGoogle Module
 */

module.exports = AuthGoogle;

/**
 * AuthGoogle Module
 */

function AuthGoogle (app) {

  /**
   * Instantiates PassportJS midlewares
   */

  strategy(app);

  /**
   * Attach routes to parent application
   */

  app.use(routes);
}
