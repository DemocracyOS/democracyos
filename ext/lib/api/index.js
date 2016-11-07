const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const validate = require('lib/api-v2/validate')

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
