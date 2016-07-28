var express = require('express')

var app = module.exports = express()
var visibility = require('lib/visibility')

/**
 * GET Add democracy form
 */

app.get('/forums/new', visibility, require('lib/settings/layout'))
