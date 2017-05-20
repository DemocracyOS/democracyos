const express = require('express')
const urlBuilder = require('lib/url-builder')
const visibility = require('lib/visibility')

const app = module.exports = express()

app.get(urlBuilder.for('site.notifications'), visibility, require('lib/site/layout'))
