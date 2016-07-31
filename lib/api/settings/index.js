/**
 * Module dependencies.
 */

var express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var log = require('debug')('democracyos:settings')
var t = require('t-component')

/**
 * Exports Application
 */

var app = module.exports = express()

app.post('/profile', restrict, function (req, res) {
  var user = req.user
  log('Updating user %s profile', user.id)

  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.profilePictureUrl = req.body.profilePictureUrl
  user.locale = req.body.locale
  // Temporarily disable email submission, until we fix the whole flow
  // Also check  ./settings/settings-profile/view.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // user.email = req.body.email

  if (user.isModified('email')) {
    log('User must validate new email')
    user.emailValidated = false
  }

  user.save(function (err) {
    if (err) return res.send(500)
    res.send(200)
  })
})

app.post('/password', restrict, function (req, res) {
  var user = req.user
  var current = req.body.current_password
  var password = req.body.password
  log('Updating user %s password', user.id)

  // !!:  Use of passport-local-mongoose plugin method
  // `authenticate` to check if user's current password is Ok.
  user.authenticate(current, function (err, authenticated) {
    if (err) return res.json(500, {error: err.message})
    // I have to send a 200 here because FormView can't show the actual error if other response code is sent.
    // This have to be modified with #531 referring to error handling in the backend.
    if (!authenticated) return res.json(200, { error: t('settings.password-invalid') })

    user.setPassword(password, function (err) {
      if (err) return res.json(500, {error: err.message})

      user.save(function (err) {
        if (err) return res.json(500, {error: err.message})
        res.send(200)
      })
    })
  })
})

app.post('/notifications', restrict, function (req, res) {
  log('Updating notifications settings with these new ones %j', req.body)
  var notifications = {}
  notifications.replies = !!req.body.replies
  notifications['new-topic'] = !!req.body['new-topic']
  var user = req.user
  user.notifications = notifications
  user.save(function (err) {
    if (err) return res.send(500)
    res.send(200)
  })
})
