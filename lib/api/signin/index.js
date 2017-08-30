/**
 * Module dependencies.
 */

var express = require('express')
var t = require('t-component')
var User = require('lib/models').User
var config = require('lib/config')
var jwt = require('lib/jwt')
var api = require('lib/db-api')
var normalizeEmail = require('lib/normalize-email')
var setDefaultForum = require('lib/middlewares/forum-middlewares').setDefaultForum
var initPrivileges = require('lib/middlewares/user').initPrivileges
var canCreate = require('lib/middlewares/user').canCreate
var canManage = require('lib/middlewares/user').canManage

var auth = User.authenticate()

/**
 * Exports Application
 */

var app = module.exports = express()

function signin (req, res, next) {
  var email = normalizeEmail(req.body.email)
  auth(email, req.body.password, function (err, user, info) {
    if (err) return res.status(200).json({ error: t(err.message) })

    if (!user) {
      return User.findByEmail(email, function (err, user) {
        if (err) {
          console.error(err)
          return res.status(500).json({ error: t('modals.error.default', req.locale) })
        }

        if (
          user &&
          user.profiles &&
          user.profiles.facebook &&
          user.profiles.facebook.email === email
        ) {
          return res.status(200).json({
            error: t('signin.error.using-facebook', req.locale)
          })
        } else {
          return res.status(200).json({ error: t(info.message, req.locale) })
        }
      })
    }

    if (!user.emailValidated) {
      return res.status(200).json({
        error: t('resend-validation-email-form.error.email-not-valid.no-link', req.locale),
        code: 'EMAIL_NOT_VALIDATED'
      })
    }

    if (user.disabledAt) {
      return res.status(200).json({ error: t('signin.account-disabled', req.locale) })
    }

    req.user = user

    return next()
  })
}

/**
 * Populate permissions after setup
 */

function addPrivileges (req, res, next) {
  return jwt.signin(api.user.expose.confidential(req.user), req, res)
}

/**
 * Define routes for SignIn module
 */

app.post('/signin', function (req, res, next) {
  var email = normalizeEmail(req.body.email)

  if (config.usersWhitelist && !~config.staff.indexOf(email)) {
    api.whitelist.search({ value: email }, function (err, whitelists) {
      if (err) console.log(err)
      if (!whitelists.length) {
        return res.send(403, { error: 'signup.whitelist.email' })
      }
      signin(req, res, next)
    })

    return
  }

  signin(req, res, next)
}, initPrivileges, canCreate, setDefaultForum, canManage, addPrivileges)

app.delete('/signin', function (req, res, next) {
  return res.clearCookie('token').send(200)
})
