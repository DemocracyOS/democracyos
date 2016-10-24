const debug = require('debug')
const express = require('express')
const validate = require('../validate')

const log = debug('democracyos:api')

const app = module.exports = express()

app.all('*', function apiLog (req, res, next) {
  log(`${req.method.toUpperCase()} ${req.url}`)
  next()
})

app.use(require('../comments'))

app.use(function validationErrorHandler (err, req, res, next) {
  if (!(err instanceof validate.SchemaValidationError)) {
    return next(err)
  }

  log(`Error ${req.method.toUpperCase()} ${req.url}`, err)

  res.json(400, {
    status: 400,
    error: {
      code: 'INVALID_REQUEST_PARAMS',
      message: err.message || 'Invalid request parameters.',
      info: err.errors
    }
  })
})

app.use(function apiError (err, req, res) {
  const status = err.status || 500
  const code = err.code || 'SERVER_ERROR'
  const message = err.message || 'Server Error.'

  log(`${req.route.method.toUpperCase()} ${req.url}`, err)

  res.json(status, {
    status: status,
    error: {
      code: code,
      message: message
    }
  })
})
