const path = require('path')
const express = require('express')
const log = require('debug')('democracyos:facebook-card')
const api = require('lib/api-v2/db-api')
const config = require('lib/config')
const utils = require('lib/utils')
const resolve = path.resolve
const urlBuilder = require('lib/url-builder')

const app = module.exports = express()

const baseUrl = utils.buildUrl(config)

app.get(urlBuilder.for('site.topic'),
function (req, res, next) {
  log('Facebook Request /topic/%s', req.params.id)

  api.topics.find({ _id: req.params.id })
    .findOne()
    .populate('forum')
    .exec()
    .then((topic) => {
      res.render(resolve(__dirname, 'topic.jade'), {
        topic: topic,
        baseUrl: baseUrl,
        url: baseUrl + urlBuilder.for('site.topic', {
          id: topic._id,
          forum: topic.forum.name
        }),
        config: config
      })
    })
    .catch(_handleError)
})

app.get('*', function (req, res, next) {
  log('Facebook Request generic page')

  res.render(resolve(__dirname, 'generic.jade'), {
    baseUrl: baseUrl,
    config: config
  })
})

function _handleError (err, req, res) {
  console.log(err)
  res.status(500).send()
}
