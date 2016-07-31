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

app.use('/signin', require('lib/api/signin'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use('/signup', require('lib/api/signup'))

/*
 * Forgot password routes
 */

app.use('/forgot', require('lib/api/forgot'))

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

app.use('/settings', require('lib/api/settings'))

/*
 * Stats routes
 */

app.use('/stats', require('lib/api/stats'))

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
