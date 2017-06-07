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
      res.json({
        status: 200,
        results: {
          forums: forums
        }
      })
    }).catch(next)
})

app.get('/search/rt/forums',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    q: {
      type: 'string',
      required: true
    }
  })
}),
function (req, res, next) {
  var page = parseInt(req.query.page, 10) || 0
  var limit = 20
  var options = {
    limit: limit,
    skip: (page - 1) * limit
  }
  res.json({
    status: 200,
    results: {
      forums: api.search.findRadix(options, req.query.q)
    }
  })
}
)

app.get('/search/rt/autocomplete',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    q: {
      type: 'string',
      required: true
    }
  })
}),
function (req, res, next) {
  res.json({
    status: 200,
    results: {
      words: api.search.autocomplete(req.query.q)
    }
  })
}
)
