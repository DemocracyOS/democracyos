const express = require('express')
const app = module.exports = express()
const api = require('lib/api-v2/db-api')
const config = require('lib/config')
const path = require('path')
const utils = require('lib/utils')
const resolve = path.resolve
const striptags = require('striptags')
const urlBuilder = require('lib/url-builder')

const log = require('debug')('democracyos:facebook-card')

const baseUrl = utils.buildUrl(config)

app.get('/facebook-card' + urlBuilder.for('site.topic'),
function (req, res, next) {
  log('Ext Facebook Request /topic/%s', req.params.id)

  api.topics.find({_id: req.params.id})
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
        config: config,
        strip: striptags
      })
    })
    .catch(_handleError)
})

app.get('/facebook-card/*', function (req, res, next) {
  log('Ext Facebook Request generic page')
  res.render(resolve(__dirname, 'generic.jade'), {
    baseUrl: baseUrl,
    config: config
  })
})

function _handleError (err, req, res) {
  console.log(err)
  res.status(500).send()
}
