var models = require('lib/models');
var Log = require('debug');
var pluck = require('lib/utils').pluck;
var log = new Log('democracyos:db-api:forum');
var Forum = models.Forum;

exports.all = function all(options, fn) {
  if ('function' === typeof options) {
    fn = options;
    options = undefined;
  }

  log('Looking for all forums.');

  var query = Forum
    .find({ deletedAt: null })
    .populate('owner')
    .sort('-createdAt');

  if (options && options.limit) query.limit(options.limit);
  if (options && options.skip) query.skip(options.skip);
  if (options && options.owner) query.find({owner: options.owner});

  query.exec(function (err, forums) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering forums %j', pluck(forums, 'id'));
    fn(null, forums);
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

exports.del = function del(forum, cb) {
  log('Deleting forum %s', forum.name);
  forum.delete(function (err) {
    if (err) log('Found error: %s', err);
    return cb(err);
  });
};

exports.findOneByOwner = function findOneByOwner(owner, fn) {
  log('Searching forum of owner %j', owner);

  Forum
  .where({ owner: owner, deletedAt: null })
  .populate('owner')
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

exports.findByOwner = function findByOwner(owner, fn) {
  log('Searching forums of owner %j', owner);

  Forum
  .where({ owner: owner, deletedAt: null })
  .populate('owner')
  .find(function(err, forums) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    fn(null, forums);
  });

  return this;
};

exports.findById = function findById(id, fn) {
  log('Searching for forum with id %s', id);

  Forum
  .where({ deletedAt: null, _id: id })
  .populate('owner')
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
  .populate('owner')
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

exports.getPermissions = function getPermissions (forumId, fn) {
  Forum.where({ _id: forumId })
  .select('permissions')
  .populate('permissions.admins permissions.collaborators')
  .findOne((err, forum) => {
    return fn(err, forum.permissions);
  });
};

exports.grantPermission = function grantPermission (forumId, user, role) {
  return new Promise((ok, error) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return error(findError);
      forum.permissions[role].addToSet(user);
      forum.save(saveError => {
        if (saveError) return error(saveError);
        return ok(forum);
      });
    });
  });
};

exports.declinePermission = function declinePermission (forumId, user, role) {
  return new Promise((ok, error) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return error(findError);
      forum.permissions[role].pull(user);
      forum.save(saveError => {
        if (saveError) return error(saveError);
        return ok(forum);
      });
    });
  });
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
