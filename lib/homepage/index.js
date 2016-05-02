/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var autologinGitlab = require('lib/auth-gitlab/middlewares').autologin;

app.get('/', autologinGitlab, require('lib/layout'));

