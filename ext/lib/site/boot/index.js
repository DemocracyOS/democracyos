const express = require('express')
const config = require('lib/config')

const app = module.exports = express()

app.use(require('../layout'))

if (config.auth.facebook.clientID) {
  app.use(require('../auth-facebook'))
}

app.use(require('../signup-complete'))
app.use(require('../static-pages'))
app.use(require('../tweets-feed'))
app.use(require('../facebook-card'))
