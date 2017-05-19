const express = require('express')
const visibility = require('lib/visibility')
const urlBuilder = require('lib/url-builder')

const app = module.exports = express()

app.get(urlBuilder.for('forums.new'), visibility, require('lib/settings/layout'))
