/**
 * Module Dependencies
 */

var api = require('lib/db-api');
var config = require('lib/config');
var utils = require('lib/utils');
var log = require('debug')('democracyos:is-owner');

function isOwner(req, res, next) {
  api.forum.findOneByOwner(req.user, function (err, forum) {
    if (err) return log('Error produced: %j', err), res.send(403);

    if (forum) return req.forum = forum, next();
    return res.sendStatus(403);
  })
}

var hasAccess = config.multiForum ? isOwner : utils.staff;

module.exports = isOwner;

module.exports.hasAccess = hasAccess;