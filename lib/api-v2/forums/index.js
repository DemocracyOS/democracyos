const express = require('express')
const middlewares = require('../middlewares')

const app = module.exports = express()

app.get('/forums/:id/search/tags',
(req, res, next) => middlewares.forums.findById(req.params.id, req, res, next),
middlewares.topics.findAllFromForum,
function searchTags (req, res, next) {
  const tags = req.topics
    .map((topic) => topic.tags)
    .reduce((tagsAcc, topicTags) => {
      if (Array.isArray(topicTags)) {
        topicTags.forEach((tag) => {
          if (tag) tagsAcc.push(tag)
        })
      }
      return tagsAcc
    }, [])
  return res.json({ tags })
})
