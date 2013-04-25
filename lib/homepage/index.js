/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  ;

/**
 * Lazy register Homepage Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Configure Homepage Application
 */

app.configure(function() {
  /**
   * Set view engine for public routes
   */
  
  app.set('view engine', 'jade');

  /**
   * Set views directory for SignUp module
   */
  
  app.set( 'views', path.join( __dirname, '/views' ) );

  /**
   * Set `public-assets` default path
   */

  app.use( express.static( path.join( __dirname, '/public' ) ) );

  /**
   * View `helper` for building up relative routes
   */
  app.locals.url = function(route) {
    var base = app.route || '';
    return path.join(app.route, route)
  };

  app.locals.bodyClasses = ['page-homepage'];

});


/**
 * Define routes for SignUp module
 */

app.get('/', function(req, res, next) {
  res.render('index');
});