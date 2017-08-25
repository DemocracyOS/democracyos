/**
 * Module dependencies.
 */

var path = require('path')
var express = require('express')
var jade = require('jade')
var t = require('t-component')
var config = require('lib/config')
var resolve = path.resolve

var app = module.exports = express()

var template = resolve(__dirname, 'index.jade')

app.get('*', function (req, res, next) {
  res.send(404, render(req.locale))
})

var renderCache = {}

function render (locale) {
  if (renderCache[locale]) return renderCache[locale]

  renderCache[locale] = jade.renderFile(template, {
    config: config,
    t: t,
    locale: locale
  })

  return renderCache[locale]
}
