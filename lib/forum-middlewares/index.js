var mongoose = require('mongoose');
var Forum = require('lib/db-api/forum');
var log = require('debug')('democracyos:forum:middleware');

module.exports.forum = function (req, res, next) {
  function found (err, forum) {
    if (err) {
      log(err);
      return res.status(404).send();
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

module.exports.private = function (req, res, next) {
  var forum = req.forum;
  var user = req.user;

  if (user &&
      forum.isOwner(user) ||
      forum.hasRole(user, 'admin', 'collaborator')) {
    return next();
  }

  if (forum.closed) {
    log('forum is closed');
    return res.status(403).json({ message: 'Forum is closed' });
  }

  return next();
};

module.exports.restrictPermissionsView = function (req, res, next) {
  var forum = req.forum;
  var user = req.user;

  if (!user || !forum) return res.status(400).send();

  if (forum.isOwner(user) || forum.hasRole(user)) {
    return next();
  } else {
    return res.status(403).send({ error: 'You can\'t change this permissions' });
  }
};

var canSetPermission = {
  admin: function (user, forum) {
    return forum.isOwner(user) || forum.hasRole(user, 'admin');
  },

  collaborator: function (user, forum) {
    return forum.isOwner(user) || forum.hasRole(user, 'admin');
  }
};

module.exports.restrictPermissionsChange = function (req, res, next) {
  var forum = req.forum;
  var user = req.user;
  var role = req.body.role;

  if (!user || !forum || !role || !canSetPermission[role]) {
    return res.status(400).send();
  }

  if (canSetPermission[role](user, forum)) {
    return next();
  } else {
    return res.status(403).send({error: 'You can\'t change this permissions'});
  }
};
