/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var config = require('lib/config');

if (config['authPages'].signinUrl) return;

app.get('/signin', require('lib/layout'));
app.get('/signin/:token', require('lib/layout'));