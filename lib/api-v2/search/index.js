const debug = require('debug')
const express = require('express')
const validate = require('../validate')
const api = require('../db-api')

var log = debug('democracyos:vote')

const app = module.exports = express()

app.post('/search/forums',
  validate({
    payload: {
      value: {
        type: 'string',
        required: true
      }
    }
  }),
  function searchForums (req, res, next) {
    api.forums.search({
      query: req.query.q
    }).then( forums => {
      res.json({
        status: 200,
        results: {
          forums: forums
        }
      })
    }).catch(next)
  }
)
