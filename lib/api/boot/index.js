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

app.use('/signin', require('lib/api/signin-api'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use('/signup', require('lib/api/signup-api'))

/*
 * Forgot password routes
 */

app.use('/forgot', require('lib/api/forgot-api'))

/**
 * Root API Service
 */

app.use('/api', require('lib/api'))

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

app.use('/settings', require('lib/api/settings-api'))

/*
 * Stats routes
 */

app.use('/stats', require('lib/api/stats-api'))

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

app.use('/api', require('lib/api/topic-api'))

/**
 * Whitelist API Service
 */

app.use('/api', require('lib/api/whitelist-api'))

/**
 * Comment API Service
 */

app.use('/api', require('lib/api/comment-api'))

/**
 * Forums API Service
 */

app.use('/api', require('lib/api/forum-api'))

/**
 * Notifications API Service
 */

app.use('/api', require('lib/api/notification-api'))
