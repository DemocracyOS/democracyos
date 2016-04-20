/**
 * Module dependencies.
 */

var routes = require('./routes');
var strategy = require('./strategy');

/**
 * Expose AuthFacebook Module
 */

module.exports = AuthGitlab;

/**
 * AuthFacebook Module
 */

function AuthGitlab (app) {

  /**
   * Instantiates PassportJS midlewares
   */

  strategy(app);

  /**
   * Attach routes to parent application
   */

  app.use(routes);
}
