const express = require('express')

const app = module.exports = express()

app.use('/api', require('./participatory-budget'))
