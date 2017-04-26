/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var visibility = require('lib/visibility')

var app = module.exports = express()

/*
 * Local signin routes
 */

if (!config.signinUrl) app.use(require('lib/api/signin'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use(require('lib/api/signup'))

/*
 * Forgot password routes
 */

app.use(require('lib/api/forgot'))

/**
 * Root API Service
 */

app.use(require('lib/api/boot/version'))

/**
 * User API Service
 */

app.use(require('lib/user'))

/*
 * Restrict private routes if neccesary
 */

app.all(visibility)

/*
 * Account routes
 */

app.use(require('lib/api/settings'))

/**
 * Tag API Service
 */

app.use(require('lib/api/tag'))

/**
 * Topic API Service
 */

app.use(require('lib/api/topic'))

/**
 * Whitelist API Service
 */

app.use(require('lib/api/whitelist'))

/**
 * Forums API Service
 */

app.use(require('lib/api/forum'))

/**
 * Notifications API Service
 */

app.use(require('lib/api/notification'))
