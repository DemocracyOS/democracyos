/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

/*
 * Create and expose app
 */
var app = exports.app = express();

/**
 * Set `app` configure settings
 */

require('./config')(app)

/*
 * Register Models and Launch Mongoose
 * with `app` configuration settings
 */

require('lib/models')(app);

// Each module has its own routes and views
// receives app as parameter to sincronize
// custom settings

/*
 * PassportJS Auth Strategies and Routes
 */

require('lib/auth')(app);

/*
 * Local signup routes
 */

app.use('/signup', require('lib/signup'));

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
 * Mount BootUp
 */

app.use(require('lib/boot'));

/*
 * Start Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Application started on port %d', app.get('port'));
});
