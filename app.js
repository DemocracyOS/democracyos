const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const { middleware: loggerMiddleware } = require('./services/logger')
const { middleware: i18nMiddleware } = require('./services/i18n')
const routes = require('./routes')
const app = express()

// Apply middlewares
app.use(helmet())
app.use(express.json())
app.use(compression())
app.use(loggerMiddleware)
app.use(i18nMiddleware)

// Apply routes
app.use(routes)

module.exports = app
