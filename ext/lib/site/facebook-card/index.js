const express = require('express')
const app = module.exports = express()
const api = require('lib/api-v2/db-api')
const config = require('lib/config')
const path = require('path')
const url = require('url')
const resolve = path.resolve
const striptags = require('striptags')
const urlBuilder = require('lib/url-builder')

const log = require('debug')('democracyos:facebook-card')


const baseUrl = url.format({
  protocol: config.protocol,
  hostname: config.host,
  port: config.publicPort
})

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
        url: urlBuilder.for('site.topic', {
          id: topic._id,
          forum: topic.forum.name
        }),
        config: config,
        strip: striptags
      })
    })
    .catch(_handleError)

  // api.topic.get(req.params.id, function (err, topicDoc) {
  //   if (err) return _handleError(err, req, res)
  //
  //   log('Serving Facebook topic %s', topicDoc.id)
  //
  //   var baseUrl = url.format({
  //     protocol: config.protocol, hostname: config.host, port: config.publicPort
  //   })
  //
  //   res.render(resolve(__dirname, 'topic.jade'), {
  //     topic: topicDoc,
  //     baseUrl: baseUrl,
  //     config: config,
  //     strip: striptags
  //   })
  // })
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
