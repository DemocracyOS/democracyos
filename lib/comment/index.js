/**
 * Module dependencies.
 */

var express = require('express')
  , api = require('lib/db-api')
  , log = require('debug')('comment')

var app = module.exports = express();

app.post('/comment/:id/reply', function (req, res) {
  log('Request /comment/%s/reply %j', req.params.id, req.body.reply);

  var reply = req.body.reply;
  // This must be uncommented on production!
  // reply.author = req.author;
  api.comment.reply(req.params.id, reply, function (err, replyDoc) {
    if (err) return _handleError(err, req, res);

    log('Serving reply %j', replyDoc);
    res.json(replyDoc);
  });
});

function _handleError (err, req, res) {
  log("Error found: %j", err);
  res.json({ error: err });
}