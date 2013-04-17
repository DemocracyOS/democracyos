/**
 * Module dependencies.
 */

var express = require('express')
  , expressUrl = require('express-url')
  , mailer = require('../mailer')
  , path = require('path')
  ;

/**
 * Lazy register SignUp Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Configure SignUp Application
 */

app.configure(function() {
  /**
   * Set view engine for public routes
   */
  app.set('view engine', 'jade');

  /**
   * Set views directory for SignUp module
   */
  app.set( 'views', __dirname );

  /**
   * Configure native `express` body parser
   */

  app.use( express.bodyParser() );

  /**
   * View `helper` for building up relative routes
   */
  
  app.use( expressUrl(app) );

});


/**
 * Define routes for SignUp module
 */

app.get('/', function(req, res, next) {
  res.render('index');
});

app.post('/register', function(req, res, next) {
  console.log(req.params, req.body, req.query);
  res.redirect('');
})