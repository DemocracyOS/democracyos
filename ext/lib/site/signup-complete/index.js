const express = require('express')

const app = module.exports = express()

app.get('/signup/complete', require('lib/site/layout'))
