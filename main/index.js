const path = require('path')
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
// i18next
const i18nextMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const { i18nInstance } = require('./i18n')

const { NODE_ENV } = process.env
const app = next({
  dev: NODE_ENV !== 'production',
  quiet: NODE_ENV === 'test'
})

module.exports = (async () => {
  try {
    i18nInstance
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        debug: false,
        fallbackLng: 'en',
        preload: ['en', 'es'], // preload all langages
        nonExplicitWhitelist: true,
        ns: ['common', 'pages', 'admin'], // need to preload all the namespaces
        backend: {
          loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
          addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
        },
        interpolation: {
          escapeValue: false // not needed for react!!
        },
        react: {
          wait: true
        }
      }, async () => {
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
        // server.use(i18nMiddleware)

        // i18n
        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance))
        // missing keys (Not really sure whats this for)
        // server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18nInstance))
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
      })
  } catch (err) {
    log.error('An error occurred, unable to start the server')
    log.error(err)
  }
})()
