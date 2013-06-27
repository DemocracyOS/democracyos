/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express()
  , path = require('path')
  , api = require('lib/db-api')

/**
 * Set `views` directory for module
 */

app.set('views', __dirname);

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade');

/**
 * View `helper` for building up relative routes
 */

app.locals.url = function(route) {
  return path.join(app.route, route);
}

/**
 * middleware for favicon
 */

app.use(express.favicon(__dirname + '/images/favicon.ico'));


/**
 * GET index page.
 */
// We should just render base html.
// This application should run fully
// from client-side with back-end
// support for data.

app.get('*', function(req, res) {
  res.render('index');
});