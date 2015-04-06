/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var staff = utils.staff;
var pluck = utils.pluck;
var log = require('debug')('democracyos:whitelist-api');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/whitelists/all', staff, function (req, res) {
  log('Request /users/all');

  api.whitelist.all(function(err, whitelists) {
    if (err) return _handleError(err, req, res);

    log('Serving whitelist %j', pluck(whitelists, 'id'));

    res.json(whitelists);
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
