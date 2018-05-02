const path = require('path')
const express = require('express')
const globalizeExpress = require('globalize-express')
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

let configGlobalize = {
  // list of supported locales
  locales: ['en', 'es'],

  // locale chosen if the requested locales was not found in the 'locales' array
  defaultLocale: 'en',

  // A custom cookie name which may contain the locale to use
  cookieName: null,

  // location of all the locale json files on disk
  messages: path.join(__dirname, '..', 'locales'),

  // An OPTIONAL array of cldr data to load into globalize
  // Checkout: https://github.com/jquery/globalize#2-cldr-content
  // If this property is not provided, globalize-express will dynamically load
  // all possible cldr-data for the locales listed above.
  localeData: [
  ],

  // Set this to true if running in development mode. This will delete cache before every access for localized string
  devMode: false
}

module.exports = (async () => {
  try {
    await app.prepare()

    const server = express()

    // Apply middlewares
    server.use(helmet())
    server.use(compression())
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(globalizeExpress(configGlobalize))
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
    expressApp.get('/admin', (req, res) => {
      if (!req.user || req.user.role !== 'admin') {
        app.render(req, res, '/404')
      } else {
        app.render(req, res, '/admin')
      }
    })

    expressApp.get('/admin/*', (req, res) => {
      if (!req.user || req.user.role !== 'admin') {
        app.render(req, res, '/404')
      } else {
        app.render(req, res, '/admin')
      }
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
