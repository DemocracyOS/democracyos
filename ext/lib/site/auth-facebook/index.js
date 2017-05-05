const passport = require('passport')
const express = require('express')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('lib/models').User
const config = require('lib/config')

const app = module.exports = express()

const strategy = new FacebookStrategy({
  clientID: config.auth.facebook.clientID,
  clientSecret: config.auth.facebook.clientSecret,
  callbackURL: '/auth/facebook/confirm/authorize',
  profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email'],
  enableProof: false
}, function (accessToken, refreshToken, profile, done) {
  done(null, new User({
    emailValidated: true,
    firstName: profile._json.first_name,
    lastName: profile._json.last_name,
    profilePictureUrl: `https://graph.facebook.com/${profile._json.id}/picture`
  }))
})

strategy.name = 'facebook-confirm'

passport.use(strategy)

app.get('/auth/facebook/confirm',
  passport.authenticate('facebook-confirm', {
    scope: config.auth.facebook.permissions,
    failureRedirect: '/signin'
  })
)

app.get('/auth/facebook/confirm/authorize',
  passport.authenticate('facebook-confirm', { failureRedirect: '/signin' }),
  function (req, res, next) {
    res.locals.initialState.authFacebookConfirmUser = {
      displayName: req.user.displayName,
      avatar: req.user.avatar
    }

    next()
  },
  function (req, res, next) {
    console.log(res.locals.initialState)
    next()
  },
  require('lib/site/layout')
)
