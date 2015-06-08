var models = require('lib/models');
var Log = require('debug');

var log = new Log('hub:db-api:deployment');
var Forum = models.Forum;

exports.all = function all(fn) {
  log('Looking for all forums');

  Forum
  .find({ deletedAt: null })
  .populate('owner')
  .select('id title summary url owner imageUrl')
  .exec(function(err, forums) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    log('Delivering forums %j', forums);

    Forum.findOne({ deletedAt: null }).exec(function(_err) {
      if (_err) {
        log('Found error: %s', _err);
        return fn(_err);
      }

      fn(null, { forums: forums });
    });
  });

  return this;
};

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

exports.findByOwner = function findByOwner(owner, fn) {
  log('Searching for forums whose owner is %s', owner);

  Forum.find({ owner: owner })
  .exec(function(err, forums) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found %d forums', forums.length);
    fn(null, forums);
  });

  return this;
};

exports.findOneByOwner = function findOneByOwner(owner, fn) {
  log('Searching forum of owner %s', owner);

  Forum
  .where({ owner: owner })
  .findOne(function(err, forum) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    if (forum) log('Found forum %s of %s', forum.name, owner);
    else log('Not Found forum of %s', owner);

    fn(null, forum);
  });

  return this;
};

exports.findById = function findById(id, fn) {
  log('Searching for forum with id %s', id);

  Forum.findById(id, function(err, forum) {
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

exports.count = function find(query, fn) {
  Forum.count(query).exec(fn);
};

exports.exists = function exists(name, fn) {
  name = normalize(name);
  Forum.findOne({ name: name }, function(err, forum) {
    return err ? fn(err) : fn(null, !!forum);
  });
};

function normalize(str) {
  return str.trim().toLowerCase();
}
