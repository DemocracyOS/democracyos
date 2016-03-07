var mongoose = require('mongoose');
var config = require('lib/config');
var Forum = require('lib/db-api/forum');
var privileges = require('lib/models/forum/privileges');

var log = require('debug')('democracyos:forum:middleware');

var exports = module.exports = {};

exports.findForum = function findForum (req, res, next) {
  function found (err, forum) {
    if (err) {
      log(err);
      return res.status(500).send();
    }
    if (!forum) {
      log(new Error('Forum not found'));
      return res.status(404).send();
    }
    req.forum = forum;
    next();
  }

  if (req.query.name) {
    Forum.findOneByName(req.query.name, found);
  } else if (req.params.id) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      log('Bad ID');
      return res.status(400).send();
    }
    Forum.findById(req.params.id, found);
  } else {
    var name = req.url.replace(/\//g, '');
    Forum.findOneByName(name, found);
  }
};

exports.findDefaultForum = function findDefaultForum (req, res, next) {
  if (config.multiForum) return next();

  Forum.findDefaultForum(function (err, forum) {
    if (err) {
      log(err);
      return res.status(500).send();
    }

    if (forum) req.forum = forum;
    next();
  });
};

exports.findCurrentForum = config.multiForum ? exports.findForum : exports.findDefaultForum;

exports.privileges = function privilegesMiddlewareGenerator (privilege) {
  if (!privileges[privilege]) throw new Error('Wrong privilege name.');

  return function privilegesMiddleware (req, res, next) {
    var forum = req.forum;
    var user = req.user;

    if (!forum) {
      log('Couldn\'t find forum.');
      return res.status(404).send();
    }

    if (privileges[privilege](forum, user)) return next();

    log('User tried to make a restricted action.');
    return res.status(404).send();
  };
};
