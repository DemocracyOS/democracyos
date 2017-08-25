var path = require('path')
var fs = require('fs')
var express = require('express')
var stylus = require('stylus')
var config = require('lib/config')

var resolve = path.resolve
var html = resolve(__dirname, 'index.jade')
var styl = resolve(__dirname, 'index.styl')

var app = module.exports = express()

app.get('/styleguide', function styleguide (req, res) {
  res.render(html, { config: config })
})

app.get('/styleguide.css', function styleguideCss (req, res) {
  fs.readFile(styl, 'utf8', function (err, str) {
    if (err) return res.status(500).send()

    stylus(str)
      .set('paths', [__dirname])
      .render(function (err, css) {
        if (err) return res.status(500).send()
        res.header('Content-type', 'text/css')
        res.send(css)
      })
  })
})
