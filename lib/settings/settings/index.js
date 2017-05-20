const express = require('express')
const config = require('lib/config')
const visibility = require('lib/visibility')
const urlBuilder = require('lib/url-builder')

const app = module.exports = express()

const action = config.settingsUrl ? redirect : require('lib/settings/layout')

app.get(urlBuilder.for('settings'), visibility, action)
app.get(urlBuilder.for('settings.profile'), visibility, action)
app.get(urlBuilder.for('settings.password'), visibility, action)
app.get(urlBuilder.for('settings.notifications'), visibility, action)
app.get(urlBuilder.for('settings.forums'), visibility, action)
app.get(urlBuilder.for('settings.user-badges'), visibility, action)

function redirect (req, res) {
  const path = req.params.path || ''
  const url = config.settingsUrl + (path ? '/' + path : '')
  res.redirect(url)
}
