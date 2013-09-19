/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , nowww = require('nowww')
  , log = require('debug')('root:config')
  , MongoStore = require('connect-mongo')(express)
  , path = require('path')
  , config = require('lib/config');

/**
 * Expose `Config`
 *
 * @api private
 */

module.exports = Config;

/**
 * Configs Express Application with
 * defaults configs
 */

function Config(app) {
  /**
   * Set `development` only settings
   */

  app.configure('development', function() {

    // Log config settigs load
    log( 'development settings' );

    /**
     * Build
     */

    app.use(require('lib/build').middleware);

  });


  /**
   * Set `testing` only settings
   */

  app.configure('testing', function() {

    // Log config settigs load
    log( 'testing settings' );

  });


  /**
   * Set `production` only settings
   */

  app.configure('production', function() {

    // Log config settigs load
    log( 'production settings' );

    /**
     * Set `nowww` middleware helper
     */

    app.use( nowww() );
    
    /**
     * Set `native` express compression middleware
     */

    app.use( express.compress() );
    
  });

  /**
   * Set `common` settings
   */

  app.configure(function() {
    // Log config settigs load
    log( 'common settings' );

    /**
     * Save config in app
     */
    
    app.set('config', config);

    /**
     * Set `mongoUrl` from config settings
     */

    app.set( 'mongoUrl', config('mongoUrl') );

    /**
     * Set application http server port from `env`
     * Defaults to 3005
     */

    app.set( 'port', config('port') || 3005 );
    
    /**
     * Set `public-assets` default path
     */

    app.use( express.static( path.join(__dirname, '..', '/public') ) );
    
    /**
     * Configure native `express` body parser
     */

    app.use( express.bodyParser() );
    
    /**
     * Configure native `express` cookie parser
     */

    app.use( express.cookieParser('democracyos-cookie') );
    
    /**
     * Configure native `express` session middleware
     */

    app.use( express.session( {
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
        secret: 'democracyos-secret',
        key: "democracyos.org",
        store: new MongoStore( { url: app.get('mongoUrl') } )
      } )
    );

    /**
     * Use `passport` setup & helpers middleware
     */

    app.use(passport.initialize());

    /**
     * Use `passport` sessions middleware
     */

    app.use(passport.session());

    /**
     * Set template local variables
     */

    app.use(function(req, res, next) {

      // Set user as local var if authenticated
      if(req.isAuthenticated() && req.user) res.locals.citizen = req.user;

      // Call next middleware
      next();

    });
        
    /**
     * Set native `express` router middleware
     */

    app.use(app.router);
    
    // Here we should have our own error handler!
    
    /**
     * Set native `express` error handler
     */

    app.use(express.errorHandler());
  });

}