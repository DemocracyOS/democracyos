'use strict'

const express = require('express')
const url = require('url')
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
function getParticipatoryBudgetProfile (req, res, next) {
  log('GET /api/participatory-budget/profile')

  User.findOne({
    'extra.cod_doc': req.data.cod_doc,
    'extra.nro_doc': Number(req.data.nro_doc),
    'extra.sexo': req.data.sexo
  }).exec(function (err, user) {
    if (err) {
      log('Error finding user: ', err)
      return next(err)
    }

    if (!user) {
      const err = new Error('User not found.')
      err.code = 'USER_NOT_FOUND'
      err.status = 404
      return next(err)
    }

    log('Serving profile of cod_doc: %s', req.query.cod_doc)

    res.json(exposeProfile(user))
  })
})

function parseToken (req, res, next) {
  var token = req.query.token || req.body.token

  if (!token) {
    const err = new Error('Invalid token.')
    err.code = 'MISSING_TOKEN'
    err.status = 400
    return next(err)
  }

  try {
    var data = jwt.decode(token, config.participatoryBudget.secret)
    req.data = data
    next()
  } catch (decodeErr) {
    const err = new Error('Invalid token.')
    err.code = 'INVALID_TOKEN'
    err.status = 400
    next(err)
  }
}

function userCanVote (user) {
  return !!(
    user &&
    user.extra &&
    user.extra.cod_doc &&
    user.extra.nro_doc &&
    user.extra.sexo
  )
}

function getUserVotingToken (user) {
  return jwt.encode({
    cod_doc: user.extra.cod_doc,
    nro_doc: user.extra.nro_doc,
    sexo: user.extra.sexo
  }, config.participatoryBudget.secret)
}

app.get('/participatory-budget/status',
middlewares.users.restrict,
function validateUserCanVoteMiddleware (req, res, next) {
  if (userCanVote(req.user)) return next()

  const err = new Error('Falta completar el perfil de votación.')
  err.code = 'MISSING_VOTING_PROFILE'
  err.status = 400
  next(err)
},
function getParticipatoryBudgetStatus (req, res, next) {
  log('GET /api/participatory-budget/status')

  let token

  try {
    token = getUserVotingToken(req.user)
  } catch (err) {
    return next(err)
  }

  request
    .get(config.participatoryBudget.statusEndpoint)
    .query({token: token})
    .end(function statusEndpointCall (err, response) {
      if (err || !response.ok) return next(err)

      try {
        const body = JSON.parse(response.text)

        res.json(200, {
          status: 200,
          results: body
        })
      } catch (err) {
        next(err)
      }
    })
})

app.get('/participatory-budget/vote',
middlewares.users.restrict,
function validateUserCanVoteMiddleware (req, res, next) {
  if (userCanVote(req.user)) return next()
  res.redirect('/')
},
function getParticipatoryBudgetStatus (req, res) {
  log('GET /api/participatory-budget/status')

  try {
    const token = getUserVotingToken(req.user)
    const endpoint = url.parse(config.participatoryBudget.votingEndpoint, true)

    endpoint.query.token = token

    res.redirect(url.format({
      protocol: endpoint.protocol,
      host: endpoint.host,
      pathname: endpoint.pathname,
      query: endpoint.query,
      hash: endpoint.hash
    }))
  } catch (err) {
    log('ERROR /api/participatory-budget/vote encoding token', err)
    return res.redirect('/500')
  }
})
