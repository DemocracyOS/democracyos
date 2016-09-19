var express = require('express')
var validate = require('../validate')

var app = module.exports = express()

app.use(require('../comments'))

app.use(function validationErrorHandler (err, req, res, next) {
  if (!(err instanceof validate.SchemaValidationError)) {
    return next(err)
  }

  res.json(400, {
    status: 400,
    error: {
      code: 'INVALID_REQUEST_PARAMS',
      message: err.message,
      info: err.errors
    }
  })
})

app.use(function apiError (err, req, res) {
  var status = err.status || 500
  var code = err.code || 'SERVER_ERROR'

  res.json(status, {
    status: status,
    error: {
      code: code,
      message: err.message
    }
  })
})
