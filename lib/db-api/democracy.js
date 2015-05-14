/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Democracy = mongoose.model('Democracy');
var log = require('debug')('hub:db-api:deployment');

exports.all = function all(fn) {
  log('Looking for all democracies');

  Democracy
  .find({ deletedAt: null })
  .populate('owner')
  .select('id title summary url owner imageUrl')
  .exec(function(err, democracies) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    log('Delivering democracies %j', democracies);

    Democracy.findOne({ deletedAt: null }).exec(function(err) {
      if (err) return log('Found error: %s', err), fn(err);
      fn(null, { democracies: democracies });
    });
  });

  return this;
};

exports.create = function create(data, fn) {
  log('Creating new democracy');

  var democracy = new Democracy(data);
  democracy.save(onsave);

  function onsave(err) {
    if (err) return log('Found error: %s', err), fn(err);

    log('Saved democracy with id %s', democracy.id);
    fn(null, democracy);
  }
};

exports.findByOwner = function findByOwner(owner, fn) {
  log('Searching for democracies whose owner is %s', owner);

  Democracy.find({ owner: owner })
  .exec(function(err, democracies) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found %d democracies', democracies.length)
    fn(null, democracies);
  });

  return this;
};

exports.findOneByOwner = function findOneByOwner(owner, fn) {
  log('Searching democracy of owner %s', owner);

  Democracy
  .where({ owner: owner })
  .findOne(function(err, democracy) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    if (democracy) log('Found democracy %s of %s', democracy.name, owner);
    else log('Not Found democracy of %s', owner);

    fn(null, democracy);
  });

  return this;
};

exports.findById = function findById(id, fn) {
  log('Searching for democracy with id %s', id);

  Democracy.findById(id, function(err, democracy) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    } else if (!democracy) {
      log('No democracy found with id %s', id);
      return fn();
    }

    log('Found democracy %s', democracy.id)
    fn(null, democracy);
  });

  return this;
};

exports.count = function find(query, fn) {
  Democracy.count(query).exec(fn);
};

exports.exists = function exists(name, fn) {
  name = normalize(name);
  Democracy.findOne({ name: name }, function(err, democracy) {
    return err ? fn(err) : fn(null, !!democracy);
  });
};

function normalize(str) {
  return str.trim().toLowerCase();
}
