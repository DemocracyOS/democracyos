const express = require('express')

const app = module.exports = express()

require('../layout')

app.use(require('../signup-complete'))
app.use(require('../static-pages'))
app.use(require('../tweets-feed'))
app.use(require('../facebook-card'))
