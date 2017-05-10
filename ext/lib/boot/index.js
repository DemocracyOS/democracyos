const express = require('express')
const setup = require('ext/lib/setup')

const app = module.exports = express()

setup(app)

require('ext/lib/browser-update')
require('ext/lib/translations')
require('ext/lib/notifier')

app.use(require('ext/lib/api'))
app.use(require('ext/lib/site/boot'))
