const express = require('express')
const setup = require('ext/lib/setup')

const app = module.exports = express()

setup(app)

app.use(require('../api'))
