'use strict'

const express = require('express')
const debug = require('debug')
const jwt = require('jwt-simple')
const request = require('superagent')
const config = require('ext/lib/config')
const utils = require('lib/utils')
const User = require('lib/models').User
const middlewares = require('lib/api-v2/middlewares')
const validate = require('lib/api-v2/validate')

const log = debug('democracyos:ext:api:participatory-budget')

const app = module.exports = express()

const exposeProfile = utils.expose([
  'id',
  'firstName',
  'lastName',
  'fullName',
  'email',
  'avatar',
  'extra.cod_doc',
  'extra.nro_doc',
  'extra.sexo'
])

app.get('/participatory-budget/profile',
parseToken,
function getParticipatoryBudgetProfile (req, res) {
  log('GET /api/participatory-budget/profile')

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
    var data = jwt.decode(token, config.participatoryBudget.secret)
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

app.get('/participatory-budget/status',
middlewares.users.restrict,
function validateUserCompleteProfile (req, res, next) {
  if (
    req.user.extra &&
    req.user.extra.cod_doc &&
    req.user.extra.nro_doc &&
    req.user.extra.sexo
  ) return next()

  res.json(400, {
    status: 400,
    error: {
      code: 'MISSING_VOTING_PROFILE',
      message: 'Falta completar el perfil de votación.'
    }
  })
},
function getParticipatoryBudgetStatus (req, res) {
  log('GET /api/participatory-budget/status')

  let token

  try {
    token = jwt.encode({
      cod_doc: req.user.extra.cod_doc,
      nro_doc: req.user.extra.nro_doc,
      sexo: req.user.extra.sexo
    }, config.participatoryBudget.secret)
  } catch (err) {
    log('ERROR /api/participatory-budget/status encoding token', err)
    return res.json(500, {
      status: 500,
      error: {
        code: 'SERVER_ERROR'
      }
    })
  }

  request
    .get(config.participatoryBudget.statusEndpoint)
    .query({token: token})
    .end(function statusEndpointCall (err, response) {
      if (err || !response.ok) {
        log('ERROR /api/participatory-budget/status status endpoint call', err)
        return res.json(500, {
          status: 500,
          error: {
            code: 'SERVER_ERROR'
          }
        })
      }

      try {
        const body = JSON.parse(response.text)

        res.json(200, {
          status: 200,
          results: body
        })
      } catch (err) {
        log('ERROR /api/participatory-budget/status status endpoint body parsing', err)
        
        res.json(500, {
          status: 500,
          error: {
            code: 'SERVER_ERROR'
          }
        })
      }
    })
})
