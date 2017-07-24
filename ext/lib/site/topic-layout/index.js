var express = require('express')
var urlBuilder = require('lib/url-builder')
var visibility = require('lib/visibility')
var Topic = require('lib/models').Topic
var ObjectID = require('mongodb').ObjectID

var app = module.exports = express()

app.get(urlBuilder.for('site.topic'), visibility, function (req, res, next) {
  Topic.findOne({ _id: ObjectID(req.params.id) })
    .then((topic) => {
      res.locals.initialState.og.img = topic.coverUrl
      res.locals.initialState.og.title = topic.mediaTitle
      next()
    }).catch(next)
}, require('ext/lib/site/layout'))
