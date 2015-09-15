var api = require('lib/db-api');
var models = require('lib/models');
var Log = require('debug');

var log = new Log('democracyos:db-api:forum');
var Forum = models.Forum;

exports.create = function create(data, fn) {
  log('Creating new forum');

  var forum = new Forum(data);
  forum.save(onsave);

  function onsave(err) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    log('Saved forum with id %s', forum.id);
    fn(null, forum);
  }
};

exports.del = function del(forum, cb) {
  log('Deleting forum %s', forum.name);
  forum.delete(function (err) {
    if (err) return cb(err);
    api.feed.remove({ forum: forum.id }, function (err) {
      cb(err);
    });
  });
};

exports.findOneByOwner = function findOneByOwner(owner, fn) {
  log('Searching forum of owner %j', owner);

  Forum
  .where({ owner: owner, deletedAt: null })
  .findOne(function(err, forum) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    if (forum) log('Found forum \'%s\' of %j', forum.name, owner);
    else log('Not Found forum of %j', owner);

    fn(null, forum);
  });

  return this;
};

exports.findById = function findById(id, fn) {
  log('Searching for forum with id %s', id);

  Forum
  .where({ deletedAt: null, _id: id })
  .findOne(function(err, forum) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    } else if (!forum) {
      log('No forum found with id %s', id);
      return fn();
    }

    log('Found forum %s', forum.id);
    fn(null, forum);
  });

  return this;
};

exports.findOneByName = function findOneByName(name, fn) {
  log('Searching for forum with name %s', name);

  Forum
  .where({ deletedAt: null, name: name })
  .findOne(function(err, forum) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    } else if (!forum) {
      log('No forum found with name %s', name);
      return fn();
    }

    log('Found forum %s', forum.name);
    fn(null, forum);
  });

  return this;
};

exports.nameIsValid = function nameIsValid(name) {
  return Forum.nameIsValid(name);
};

exports.exists = function exists(name, fn) {
  name = normalize(name);
  Forum
  .find({ deletedAt: null, name: name })
  .limit(1)
  .exec(function(err, forum) {
    return fn(err, !!(forum && forum.length));
  });
};

function normalize(str) {
  return str.trim().toLowerCase();
}
