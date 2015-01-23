/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var nowww = require('nowww');
var log = require('debug')('setup');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var resolve = require('path').resolve;
var config = require('lib/config');
var auth = require('http-auth');
var jwt = require('lib/jwt');
var ssl = require('./ssl');
var t = require('t-component');

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

  /*
   *  Connect to mongo
   */

  mongoose.connect(config('mongoUrl'), { db: { safe: true }});


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
     * Basic HTTP-Auth restriction middleware
     * for production access only.
     */

    if (config.auth.basic && config.auth.basic.username && config.auth.basic.password) {
      var basic = auth({
        authRealm: 'Authentication required',
        authList : [config.auth.basic.username+':'+config.auth.basic.password]
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

    app.use(express.urlencoded());
    app.use(express.json());

    /**
     * JSON Web Tokens
     */

    app.set('jwtTokenSecret', config('secret'));

    app.use(jwt.middlewares.user(app.get('jwtTokenSecret')));

    /**
     * Use `passport` setup & helpers middleware
     */

    app.use(passport.initialize());

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

  /**
   * Ensure SSL redirection if necessary
   */

  ssl(app);
}