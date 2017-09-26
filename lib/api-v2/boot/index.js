const debug = require('debug')
const express = require('express')
const mongoose = require('mongoose')
const errorToSlack = require('express-error-slack')
const config = require('lib/config')
const validate = require('../validate')

const log = debug('democracyos:api')

const app = module.exports = express()

app.all('*', function apiLog (req, res, next) {
  log(`${req.method.toUpperCase()} ${req.app.mountpath}${req.url}`)
  next()
})

app.use(require('../topics'))
app.use(require('../topics/csv'))
app.use(require('../forums'))
app.use(require('../comments'))
app.use(require('../comments/csv'))
app.use(require('../search'))

app.use(function mongooseCastErrorHandler (err, req, res, next) {
  if (!(err instanceof mongoose.CastError)) {
    return next(err)
  }

  const error = new Error('Invalid id parameter.')
  error.status = 400
  error.code = 'INVALID_REQUEST_PARAMS'

  next(error)
})

app.use(function validationErrorHandler (err, req, res, next) {
  if (!(err instanceof validate.SchemaValidationError)) {
    return next(err)
  }

  const error = new Error('Invalid request parameters.')
  error.status = 400
  error.code = 'INVALID_REQUEST_PARAMS'
  error.info = err.errors

  next(error)
})

if (config.slack.apiErrorWebhookUri) {
  app.use(errorToSlack({ webhookUri: config.slack.apiErrorWebhookUri }))
}

app.use(function apiError (err, req, res, next) {
  const status = err.status || 500

  const error = {
    code: 'SERVER_ERROR',
    message: 'Server Error.',
    info: err.info
  }

  // Never show error data of uncatched errors on production
  if (status !== 500 || config.env === 'development') {
    if (err.code) error.code = err.code
    if (err.message) error.message = err.message
  }

  log(`Error: ${req.method.toUpperCase()} ${req.app.mountpath}${req.url}`, err)

  res.status(status).json({
    status: status,
    error: error
  })
})
