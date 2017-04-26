const express = require('express')
const middlewares = require('../middlewares')

const app = module.exports = express()

app.get('/forums/:id/tags',
middlewares.forums.findById,
middlewares.forums.findTags,
function tags (req, res, next) {
  return res.json({
    status: 200,
    results: {
      tags: req.tags
    }
  })
})
