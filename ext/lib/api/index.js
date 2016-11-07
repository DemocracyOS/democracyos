const debug = require('debug')
const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const validate = require('lib/api-v2/validate')

const log = debug('democracyos:ext:api')

const app = module.exports = express()

app.use('/ext/api', require('./participatory-budget'))

app.use(function validationErrorHandler (err, req, res, next) {
  if (!(err instanceof validate.SchemaValidationError)) return next(err)

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

  const method = (req.method || 'GET').toUpperCase()

  if (status === 500) {
    log(`ERROR ${method} ${req.url}`, err)
  }

  res.json(status, {
    status: status,
    error: {
      code: code,
      message: message
    }
  })
})
