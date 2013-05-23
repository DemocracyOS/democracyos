/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Proposal = mongoose.model('Proposal')
  , tagApi = require('./tag')
  , log = require('debug')('db-api:proposal');

/**
 * Get all proposals
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposals' list items found or `undefined`
 * @return {Module} `proposal` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all proposals.')

  Proposal.find(function (err, proposals) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering proposals %j', mapByProperty(proposals, 'id'));
    fn(null, proposals);
  });

  return this;
}

/**
 * Create or retrieve Proposal from `proposal` descriptor
 *
 * @param {Object} proposal object descriptor
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @return {Module} `proposal` module
 * @api public
 */

exports.create = function create(proposal, fn) {
  log('Creating new proposal %j', proposal);

  // wrong using tag api within proposal's
  log('Looking for tag %s in database.', proposal.tag);
  tagApi.create(proposal.tag, function (err, tag) {
    if (err) {
      log('Found error from tag creation %j', err);
      return fn(err);
    };
    
    proposal.tag = tag;
    (new Proposal(proposal)).save(function (err, saved) {
      if (err) {
        log('Found error %j', err);
        return fn(err);
      };
      console.log(saved.populate);
      log('Delivering proposal %j', saved);
      fn(null, saved);
    });
  })

  return this;
};

/**
 * Get Proposal form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Proposal's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  log('Loking for proposal %s', id);

  Proposal.findById(id, function (err, proposal) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering proposal %j', proposal);
    fn(null, proposal);
  });
};

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function(item) { return item[prop]; });
}