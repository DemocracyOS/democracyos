const debug = require('debug')
const express = require('express')
const validate = require('../validate')
const api = require('../db-api')

const app = module.exports = express()

app.get('/search/forums',
  validate({
    query: {
      q: {
        type: 'string',
        required: true
      }
    }
  }),
  function searchForums (req, res, next) {
    api.search.searchForum(
      req.query.q
      ).then((forums) => {
        res.json({
          status: 200,
          results: {
            forums: forums
          }
        })
      }).catch(next)
  }
)
