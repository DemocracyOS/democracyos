var express = require('express')
var app = module.exports = express()
var api = require('lib/db-api')
var config = require('lib/config')
var path = require('path')
var url = require('url')
var resolve = path.resolve
var striptags = require('striptags')
var urlBuilder = require('lib/url-builder')
var log = require('debug')('democracyos:facebook-card')

app.get('/facebook-card' + urlBuilder.for('site.topic'), function (req, res, next) {
  log('Ext Facebook Request /topic/%s', req.params.id)
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res)
    log('Serving Facebook topic %s', topicDoc.id)
    var baseUrl = url.format({
      protocol: config.protocol, hostname: config.host, port: config.publicPort
    })
    res.render(resolve(__dirname, 'topic.jade'),
      { topic: topicDoc,
        baseUrl: baseUrl,
        config: config,
        strip: striptags
      })
  })
})

app.get('/facebook-card/*', function (req, res, next) {
  log('Ext Facebook Request generic page')
  var baseUrl = url.format({
    protocol: config.protocol, hostname: config.host, port: config.publicPort
  })
  res.render(resolve(__dirname, 'generic.jade'),
    { baseUrl: baseUrl,
    config: config})
})

function _handleError (err, req, res) {
  console.log(err)
  res.status(500).send()
}
