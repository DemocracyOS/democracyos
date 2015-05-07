/**
 * Module dependencies.
 */

var routes = require('./routes')
  , strategy = require('./strategy')

/**
 * Expose Auth Module
 */

module.exports = Auth;

/**
 * Auth Module defining routes and 
 */
function Auth (app) {

  /**
   * Instantiates PassportJS midlewares
   */
  
  strategy(app);


  /**
   * Attach routes to parent application
   */
  
  app.use(routes);
}