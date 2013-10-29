/**
 * Module dependencies.
 */
 
 var express = require('express')
  , passport = require('passport')

/**
 * Lazy create app
 */

var app;

/**
 * Expose auth app
 */

module.exports = app = express();

/**
 * Local Auth routes
 */

app.post('/login'
  , passport.authenticate('local', { failureRedirect: '/' })
  , function(req, res) {
    res.redirect('/');
  }
);

/**
 * Logout
 */

app.get('/logout'
  , function(req, res, next) {
    req.logout();
    res.redirect('/')
  }
);