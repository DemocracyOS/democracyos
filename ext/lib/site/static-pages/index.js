const express = require('express')

const app = module.exports = express()

app.get('/s/*', require('lib/site/layout'))
