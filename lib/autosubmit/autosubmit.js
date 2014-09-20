/**
 * Module dependencies.
 */

var debug = require('debug')('democracyos:autosubmit');
var o = require('dom');
var request = require('request');
var serialize = require('serialize');

module.exports = function(form, fn, postserialize) {
  var form = o(form);
  var action = form.attr('action');
  var method = form.attr('method').toLowerCase();
  var data = serialize.object(form[0]);
  if (postserialize) postserialize(data);
  debug('%s %s', action, method);

  if ('delete' == method) {
    method = 'del';
  }

  var req = request[method](action).send(data);
  req.end(function(err, res) {
    debug('%s response', res.status);
    fn(err, res);
  });
  return req;
}