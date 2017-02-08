const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const validate = require('lib/api-v2/validate')

const app = module.exports = express()

app.get('/signup/complete', require('lib/site/layout'))

app.post('/signup/complete',
middlewares.users.restrict,
validate({
  payload: {
    cod_doc: {
      type: 'string',
      required: true,
      enum: ['DNI', 'LC', 'LE'],
    },
    sexo: {
      type: 'string',
      enum: ['M', 'F'],
      required: true
    },
    nro_doc: {
      type: 'string',
      format: 'numeric',
      required: true
    }
  }
}, {
  filter: true
}),
function postSignupComplete (req, res) {
  const currentExtra = req.user.extra || {}

  const data = {
    cod_doc: currentExtra.cod_doc || req.body.cod_doc,
    sexo: currentExtra.sexo || req.body.sexo,
    nro_doc: currentExtra.nro_doc || Number(req.body.nro_doc)
  }

  req.user.extra = data

  req.user.save(function (err, user) {
    if (err) {
      return res.json(500, {
        status: 500,
        error: {
          code: 'SERVER_ERROR',
          message: err.message || 'Server Error'
        }
      })
    }

    res.json(200, {
      status: 200,
      results: {
        extra: data
      }
    })
  })
})

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
