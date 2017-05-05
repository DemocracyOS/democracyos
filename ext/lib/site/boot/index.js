const express = require('express')

const app = module.exports = express()

app.use(require('../layout'))
app.use(require('../auth-facebook'))
app.use(require('../signup-complete'))
app.use(require('../static-pages'))
app.use(require('../tweets-feed'))
app.use(require('../facebook-card'))
