/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , api = require('lib/db-api')
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
 * Define routes for Homepage module
 */

app.get('/', function(req, res, next) {
  api.proposal.all(function(err, proposals) {
    res.render('index', {proposals: proposals, proposal: proposals[0] || {} });
  });
});

// !!! This must be handled differently.
app.get('/proposal/:id', function(req, res, next) {
  api.proposal.all(function(err, proposals) {
    api.proposal.get(req.params.id, function(err, proposal) {
      res.render('index', { proposals: proposals, proposal: proposal });
    });
  });
});