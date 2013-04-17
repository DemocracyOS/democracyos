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

/*
 * Facebook Auth routes
 */

app.get('/auth/facebook'
  , passport.authenticate('facebook', { scope: [ 'email', 'user_birthday', 'user_location', 'user_photos' ] })
);

app.get('/auth/facebook/callback'
  , passport.authenticate('facebook'
    , {
        sucessRedirect: '/'
      , failureRedirect: '/'
    }
  )
);

/**
 * Twitter Auth routes
 */

app.get('/auth/twitter'
  , passport.authenticate('twitter')
);

app.get('/auth/twitter'
  , passport.authenticate('twitter'
    , {
        successRedirect: '/'
      , failureRedirect: '/'
    }
  )
);