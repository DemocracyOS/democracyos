const express = require('express')
const Forum = require('lib/models').Forum
const Topic = require('lib/models').Topic

const app = module.exports = express()

app.get('/',
function getNoticias (req, res, next) {
  Forum.findOne({ name: 'noticias' })
    .then((forum) => {
      Topic.findOne({ forum: forum._id })
        .sort({ created_at: -1 })
        .exec(function (err, topic) {
          if (err) {
            res.json({ result: null, error: err })
          } else {
            res.json({ result: { topic } })
          }
        })
    })
    .catch((err) => {
      res.json({ result: null, error: err })
    })
})
