const express = require('express')
const validate = require('../validate')
const api = require('../db-api')

const app = module.exports = express()
app.get('/search/forums',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    q: {
      type: 'string',
      required: true
    }
  })
}),
function (req, res, next) {
  const options = {
    limit: req.query.limit,
    page: req.query.page
  }

  api.search.searchForum(options, req.query.q)
    .then((forums) => {
      res.status(200).json({
        status: 200,
        results: {
          forums: forums
        }
      })
    }).catch(next)
})
