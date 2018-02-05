const express = require('express')
const next = require('next')
const nextAuth = require('next-auth')
const compression = require('compression')
const helmet = require('helmet')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const authFunctions = require('../users/auth/functions')
const authProviders = require('../users/auth/providers')
const { PORT, SESSION_SECRET, ROOT_URL } = require('./config')
const { middleware: loggerMiddleware, log } = require('./logger')
const { middleware: i18nMiddleware } = require('./i18n')
const mongoose = require('./mongoose')

const { NODE_ENV } = process.env
const app = next({
  dev: NODE_ENV !== 'production',
  quiet: NODE_ENV === 'test'
})

module.exports = (async () => {
  try {
    await app.prepare()

    const server = express()

    // Apply middlewares
    server.use(helmet())
    server.use(compression())
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(passport.initialize())
    server.use(passport.session())
    // server.use(loggerMiddleware)
    server.use(i18nMiddleware)

    // Apply API routes
    server.use('/api/v1.0', require('./api'))

    // Init authentication and next server
    await nextAuth(app, {
      sessionSecret: SESSION_SECRET,
      providers: authProviders(),
      bodyParser: false,
      cookieParser: false,
      expressApp: server,
      functions: authFunctions,
      port: PORT,
      serverUrl: ROOT_URL,
      sessionStore: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
        collection: 'sessions',
        stringify: false
      })
    })
    return server
  } catch (err) {
    log.error('An error occurred, unable to start the server')
    log.error(err)
  }
})()
