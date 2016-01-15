/**
 * Module dependencies.
 */

var express = require('express')
var log = require('debug')('democracyos:auth:routes')

/**
 * Expose auth app
 */

var app = module.exports = express()

/**
 * Logout
 */

app.post('/logout',
  function (req, res) {
    try {
      req.logout()
      log('Logging out user %s', req.user)
      res.send(200)
    } catch (err) {
      log('Failed to logout user: %s', err)
      res.send(500)
    }
  }
)
