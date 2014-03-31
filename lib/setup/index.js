/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , nowww = require('nowww')
  , log = require('debug')('root:config')
  , MongoStore = require('connect-mongo')(express)
  , mandrillMailer = require('lib/mailer').mandrillMailer
  , resolve = require('path').resolve
  , config = require('lib/config')
  , auth = require('http-auth')
  , t = require('t-component');

/**
 * Expose `Setup`
 *
 * @api private
 */

module.exports = Setup;

/**
 * Configs Express Application with
 * defaults configs
 */

function Setup(app) {
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
     * Config mandrill mailer
     */

    mandrillMailer(app);

    /**
     * Basic HTTP-Auth restriction middleware
     * for production access only.
     */

    if (config.auth.basic && config.auth.basic.username && config.auth.basic.password) {
      var basic = auth({
        authRealm: "Authentication required",
        authList : [config.auth.basic.username+":"+config.auth.basic.password]
      });
      app.use(function(req, res, next) {
        basic.apply(req, res, function(username) {
          return next();
        });
      });
    }

    /**
     * Set application http server port from `env`
     * Defaults to 3005
     */

    app.set( 'port', config('privatePort') || 3005 );
    
    /**
     * Set `public-assets` default path
     */

    app.use(express.static(resolve('public')));
    
    /**
     * Configure native `express` body parser
     */

    // `express.bodyParsers()` uses `connect.multipart()`
    // check https://github.com/senchalabs/connect/wiki/Connect-3.0
    // for more details on the temporal fix.
    // app.use( express.bodyParser() );
    app.use(express.urlencoded());
    app.use(express.json());

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
        store: new MongoStore( { url: config('mongoUrl') } )
      } )
    );

    /**
     * Use `express.csrf` middleware
     */

    app.use(express.csrf());
    app.use(function (req, res, next) {
      res.locals.csrfToken = req.csrfToken();
      next();
    });

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

      res.locals.t = t;

      // Call next middleware
      next();

    });

    /**
     * Use `twitter-card` and 'facebook-card' middlewares
     */

    app.use(require('lib/twitter-card/middleware'));
    app.use(require('lib/facebook-card/middleware'));

  });

}