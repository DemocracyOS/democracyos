const express = require('express')
const setup = require('ext/lib/setup')

const app = module.exports = express()

setup(app)

require('ext/lib/notifier')

app.use(require('ext/lib/api'))
app.use(require('ext/lib/site/boot'))
