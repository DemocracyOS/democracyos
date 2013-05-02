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

/**
 * Homepage
 */

app.use('/', require('lib/homepage'));

/**
 * SignUp routes
 */

app.use('/signup', require('lib/signup'));

/*
 * Start Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Application started on port %d', app.get('port'));
});
