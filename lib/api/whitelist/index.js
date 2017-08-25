/**
 * Module dependencies.
 */

var express = require('express')
var log = require('debug')('democracyos:whitelist-api')
var api = require('lib/db-api')
var config = require('lib/config')
var utils = require('lib/utils')
var accepts = require('lib/accepts')
var staff = utils.staff
var pluck = utils.pluck

function _handleError (err, req, res) {
  log('Error found: %s', err)
  var error = err
  if (err.errors && err.errors.text) error = err.errors.text
  if (error.type) error = error.type

  res.status(400).json({ error: error })
}

var app = module.exports = express()

if (config.usersWhitelist) {
  /**
   * Limit request to json format only
   */

  app.use(accepts('application/json'))

  app.get('/whitelists/all', staff, function (req, res) {
    log('Request /whitelists/all')

    api.whitelist.all(function (err, whitelists) {
      if (err) return _handleError(err, req, res)

      log('Serving whitelist %j', pluck(whitelists, 'id'))

      res.status(200).json(whitelists)
    })
  })

  app.get('/whitelists/:id', staff, function (req, res) {
    var id = req.params.id
    log('Request /whitelists/%s', id)

    api.whitelist.get(id, function (err, whitelist) {
      if (err) return _handleError(err, req, res)

      log('Serving whitelist %j', whitelist)

      res.status(200).json(whitelist)
    })
  })

  app.post('/whitelists/create', staff, function (req, res, next) {
    log('Request /whitelists/create %j', req.body)

    api.whitelist.create(req.body, function (err, whitelists) {
      if (err) return next(err)

      log('Serving whitelists %s', pluck(whitelists, 'id'))
      res.status(200).json(whitelists)
    })
  })

  app.post('/whitelists/:id', staff, function (req, res) {
    log('Request /whitelists/:id %j', req.params.id, req.body)

    api.whitelist.update(req.params.id, req.body, function (err, whitelist) {
      if (err) return _handleError(err, req, res)

      log('Serving whitelist %s', whitelist)
      res.status(200).json(whitelist.toJSON())
    })
  })

  app.delete('/whitelists/:id', staff, function (req, res) {
    var id = req.params.id
    log('Request /whitelists/%s', id)

    api.whitelist.remove(id, function (err) {
      if (err) return _handleError(err, req, res)

      log('Whitelist %j deleted successfully', id)

      res.status(200).send()
    })
  })
}
