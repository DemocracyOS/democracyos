const express = require('express')
const debug = require('debug')
const jwt = require('jwt-simple')
const config = require('ext/lib/config')
const utils = require('lib/utils')
const User = require('lib/models').User

const log = debug('democracyos:ext:api:participatory-budget')

const app = module.exports = express()

const exposeProfile = utils.expose([
  'id',
  'firstName',
  'lastName',
  'email',
  'avatar',
  'extra.cod_doc',
  'extra.nro_doc',
  'extra.sexo'
])

app.get('/participatory-budget/profile', parseToken, function (req, res) {
  log('Request participatory-budget/profile')

  User.findOne({
    'extra.cod_doc': req.data.cod_doc,
    'extra.nro_doc': Number(req.data.nro_doc),
    'extra.sexo': req.data.sexo
  }).exec(function (err, user) {
    if (err) {
      log('Error finding user: ', err)
      return res.status(500).end()
    }

    if (!user) {
      return res.json(404, {
        status: 404,
        error: {
          code: 'USER_NOT_FOUND'
        }
      })
    }

    log('Serving profile of cod_doc: %s', req.query.cod_doc)

    res.json(exposeProfile(user))
  })
})

function parseToken (req, res, next) {
  var token = req.query.token || req.body.token

  if (!token) {
    return res.json(400, {
      status: 400,
      error: {
        code: 'MISSING_TOKEN'
      }
    })
  }

  try {
    var data = jwt.decode(token, config.participatoryBudgetSecret)
    req.data = data
    next()
  } catch (e) {
    res.json(400, {
      status: 400,
      error: {
        code: 'INVALID_TOKEN'
      }
    })
  }
}
