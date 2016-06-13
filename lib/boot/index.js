/**
 * Module dependencies.
 */

var express = require('express')
var path = require('path')
var translations = require('lib/translations')
var t = require('t-component')
var config = require('lib/config')
var visibility = require('lib/visibility')

var app = module.exports = express()

/**
 * Set `views` directory for module
 */

app.set('views', __dirname)

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade')

/**
 * middleware for favicon
 */

app.use(express.favicon(path.join(__dirname, '/assets/favicon.ico')))

/*
 * Register Models and Launch Mongoose
 */

require('lib/models')(app)

/**
 * Set `app` configure settings
 */

require('lib/setup')(app)

/*
 * PassportJS Auth Strategies and Routes
 */

require('lib/auth')(app)

/*
 * Twitter card routes
 */

app.use('/twitter-card', require('lib/twitter-card'))

/*
 * Facebook card routes
 */

app.use('/facebook-card', require('lib/facebook-card'))

/*
 * Local signin routes
 */

app.use('/signin', require('lib/signin-api'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use('/signup', require('lib/signup-api'))

/*
 * Forgot password routes
 */

app.use('/forgot', require('lib/forgot-api'))

/**
 * Root API Service
 */

app.use('/api', require('lib/api'))

/**
 * User API Service
 */

app.use('/api', require('lib/user'))

app.use(require('lib/signin'))
app.use(require('lib/signup'))
app.use(require('lib/forgot'))

/*
 * Restrict private routes if neccesary
 */

app.all('*', visibility)

/*
 * Account routes
 */

app.use('/settings', require('lib/settings-api'))

/*
 * Stats routes
 */

app.use('/stats', require('lib/stats-api'))

/*
 * RSS routes
 */

app.use('/rss', require('lib/rss'))

/**
 * Tag API Service
 */

app.use('/api', require('lib/tag'))

/**
 * Topic API Service
 */

app.use('/api', require('lib/topic-api'))

/**
 * Whitelist API Service
 */

app.use('/api', require('lib/whitelist-api'))

/**
 * Comment API Service
 */

app.use('/api', require('lib/comment'))

/**
 * Forums API Service
 */

app.use('/api', require('lib/forum-api'))

/**
 * Notifications API Service
 */

app.use('/api', require('lib/notification-api'))

/**
 * Load localization dictionaries to translation application
 */

translations.help(t)

/**
 * Init `t-component` component with parameter locale
 */

t.lang(config.locale)

/**
 * Set native `express` router middleware
 */

app.use(app.router)

// Here we should have our own error handler!

/**
 * Set native `express` error handler
 */

app.use(express.errorHandler())

/**
 * Load Styleguide
 */
if (config.env !== 'production') {
  app.use(require('lib/styleguide'))
}

/**
 * GET index page.
 */

app.use(require('lib/browser-update'))
app.use(require('lib/admin'))
app.use(require('lib/settings'))
app.use(require('lib/help'))
app.use(require('lib/homepage'))
app.use(require('lib/topic'))
app.use(require('lib/notifications-page'))
app.use(require('lib/forum'))
app.use(require('lib/404'))
