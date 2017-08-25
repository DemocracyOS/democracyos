/**
 * Module dependencies.
 */

var express = require('express')
var accepts = require('lib/accepts')
var version = require('package.json').version

var app = module.exports = express()

/**
 * Limit request to json format only
 */

app.use(accepts(['application/json', 'text/html']))

app.get('/', function (req, res) {
  res.status(200).json({
    app: 'democracyos',
    env: process.env.NODE_ENV,
    version: version,
    apiUrl: '/api'
  })
})
