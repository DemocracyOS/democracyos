/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express()
  , path = require('path')
  , api = require('lib/db-api')
  , translations = require('lib/translations')
  , t = require('t-component')
  , config = require('lib/config');


/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t-component` component with
 * locale as `es`
 */

t.lang('es');

/**
 * Set `views` directory for module
 */

app.set('views', __dirname);

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade');

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
  res.render('index', {config : config});
});