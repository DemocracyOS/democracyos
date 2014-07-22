/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var restrict = utils.restrict;
var expose = utils.expose;
var log = require('debug')('democracyos:law');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.post('/law/:lawId/clauses/:clauseId/comment', restrict, function (req, res) {
  log('Request /law/:lawId/clauses/:clauseId/comment %j', req.params.lawId, req.params.clauseId, req.body);

  var comment = req.body;
  comment.author = req.user;

  api.clause.comment(req.params.lawId, req.params.clauseId, comment, function (err, commentDoc) {
    if (err) return _handleError(err, req, res);

    console.log(JSON.stringify(commentDoc));

    var keys = [
      'id author.id author.fullName author.gravatar() comment createdAt score votes clauseId'
    ].join(' ');

    res.json(200, expose(keys)(commentDoc));
  });
});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}