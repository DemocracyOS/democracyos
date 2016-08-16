var express = require('express')
var validate = require('../validate')

var app = module.exports = express()

app.use(require('../comments'))

app.use(function validationErrorHandler (err, req, res, next) {
  if (!(err instanceof validate.SchemaValidationError)) {
    return next(err)
  }

  res.json(400, {
    error: {
      status: 400,
      code: 'INVALID_REQUEST_PARAMS',
      message: err.message,
      info: err.errors
    }
  })
})

app.use(function apiError (err, req, res, next) {
  res.json(500, {
    error: {
      status: 500,
      code: 'SERVER_ERROR',
      message: err.message
    }
  })
})
