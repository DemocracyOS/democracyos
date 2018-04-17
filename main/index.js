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
const { setup } = require('../services/setup')
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

    // Init authentication and next server
    const nextAuthOptions = await nextAuth(app, {
      sessionSecret: SESSION_SECRET,
      providers: authProviders(),
      expressApp: server,
      functions: authFunctions,
      serverUrl: ROOT_URL,
      expressSession: session,
      sessionStore: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions',
        stringify: false
      })
    })
    // Express App
    const expressApp = nextAuthOptions.expressApp
    // Apply setup service
    expressApp.all('/', setup)

    // Apply API routes
    expressApp.use('/api/v1.0', require('./api'))

    // Admin page
    expressApp.get('/admin/*', (req, res) => {
      app.render(req, res, '/admin')
    })

    expressApp.all('*', (req, res) => {
      let nextRequestHandler = app.getRequestHandler()
      return nextRequestHandler(req, res)
    })

    return expressApp.listen(PORT, (err) => {
      if (err) {
        throw err
      }
      console.log('> Ready on http://localhost:' + PORT + ' [' + NODE_ENV + ']')
    })
  } catch (err) {
    log.error('An error occurred, unable to start the server')
    log.error(err)
  }
})()
