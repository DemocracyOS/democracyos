/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var path = require('path');
var translations = require('lib/translations');
var t = require('t-component');
var config = require('lib/config');


/**
 * Set `views` directory for module
 */

app.set('views', __dirname);

/**
 * Set `view engine` to `jade`.
 */

app.set('view engine', 'jade');

/**
 * middleware for favicon
 */

app.use(express.favicon(__dirname + '/images/favicon.ico'));

/**
 * Set `app` configure settings
 */

require('lib/setup')(app);

/*
 * Register Models and Launch Mongoose
 * with `app` configuration settings
 */

require('lib/models')(app);

/*
 * PassportJS Auth Strategies and Routes
 */

require('lib/auth')(app);

/*
 * Twitter card routes
 */

app.use('/twitter-card', require('lib/twitter-card'));

/*
 * Facebook card routes
 */

app.use('/facebook-card', require('lib/facebook-card'));

/*
 * Local signin routes
 */

app.use('/signin', require('lib/signin'));

/*
 * Local signup routes
 */

app.use('/signup', require('lib/signup'));

/*
 * Account routes
 */

app.use('/settings', require('lib/settings'));

/*
 * Forgot password routes
 */

app.use('/forgot', require('lib/forgot'));

/*
 * RSS feed routes
 */

app.use('/rss', require('lib/rss'));

/**
 * Store session routes
 */

app.use(require('lib/store'));

/**
 * Tag API Service
 */

app.use('/api', require('lib/tag'));

/**
 * Proposal API Service
 */

app.use('/api', require('lib/proposal'));

/**
 * Law API Service
 */

app.use('/api', require('lib/law'));

/**
 * Comment API Service
 */

app.use('/api', require('lib/comment'));

/**
 * Citizen API Service
 */

app.use('/api', require('lib/citizen'));

/**
 * Delegation API Service
 */

app.use('/api', require('lib/delegation'));

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t-component` component with
 * locale as `es`
 */

t.lang('es');

/**
 * Set native `express` router middleware
 */

app.use(app.router);

// Here we should have our own error handler!

/**
 * Set native `express` error handler
 */

app.use(express.errorHandler());

/**
 * GET index page.
 */

app.get('*', function(req, res) {
  res.render('index', {config : config});
});