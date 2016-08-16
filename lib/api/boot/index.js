/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var visibility = require('lib/visibility')

var app = module.exports = express()

/*
 * Comments API Service
 */

app.use('/api/v2', require('lib/api/v2/boot'))

/*
 * Local signin routes
 */

if (!config.signinUrl) app.use('/api', require('lib/api/signin'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use('/api', require('lib/api/signup'))

/*
 * Forgot password routes
 */

app.use('/api', require('lib/api/forgot'))

/**
 * Root API Service
 */

app.use('/api', require('lib/api/boot/version'))

/**
 * User API Service
 */

app.use('/api', require('lib/user'))

/*
 * Restrict private routes if neccesary
 */

app.all('*', visibility)

/*
 * Account routes
 */

app.use('/api', require('lib/api/settings'))

/*
 * Stats routes
 */

app.use('/api', require('lib/api/stats'))

/**
 * Tag API Service
 */

app.use('/api', require('lib/api/tag'))

/**
 * Topic API Service
 */

app.use('/api', require('lib/api/topic'))

/**
 * Whitelist API Service
 */

app.use('/api', require('lib/api/whitelist'))

/**
 * Comment API Service
 */

app.use('/api', require('lib/api/comment'))

/**
 * Forums API Service
 */

app.use('/api', require('lib/api/forum'))

/**
 * Notifications API Service
 */

app.use('/api', require('lib/api/notification'))
