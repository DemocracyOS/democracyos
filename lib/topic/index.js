/**
 * Module dependencies.
 */

var express = require('express');
var config = require('lib/config');
var router = require('lib/router')(config);

/**
 * Exports Application
 */

var app = module.exports = express();

app.get(router('/topic/:id'), require('lib/layout'));
