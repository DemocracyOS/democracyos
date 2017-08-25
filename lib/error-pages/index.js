/**
 * Module dependencies.
 */

var path = require('path')
var jade = require('jade')
var resolve = path.resolve
var t = require('t-component')
var express = require('express')
var config = require('lib/config')
var html = jade.renderFile(resolve(__dirname, 'index.jade'), { config: config, t: t })
var app = module.exports = express()

app.get('*', function (req, res, next) {
  res.send(404, html)
})
