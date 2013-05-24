/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Proposal = mongoose.model('Proposal')
  , tagApi = require('./tag')
  , commentApi = require('./comment')
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

  Proposal
  .find()
  .populate('author', 'id firstName lastName fullName avatar')
  .populate('tag', 'id hash')
  .sort('-createdAt')
  .exec(function (err, proposals) {
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

  Proposal
  .findById(id)
  .populate('author', 'id firstName lastName fullName avatar')
  .populate('tag', 'id hash')
  .exec(function (err, proposal) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering proposal %j', proposal);
    fn(null, proposal);
  });
};

/**
 * Direct comment to proposal
 *
 * @param {String} id Proposal's `id`
 * @param {Object} comment to attach
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.comment = function comment(id, comment, fn) {
  log('Creating comment %j for proposal %s', comment, id);
  commentApi.create(id, comment, function (err, commentDoc) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering comment %j', commentDoc);
    fn(null, commentDoc);
  });
};

/**
 * Vote proposal
 *
 * @param {String} id Proposals `id`
 * @param {String} citizen author of the vote
 * @param {String} value `positive` or `negative` only
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'proposal' single object created or `undefined`
 * @api public
 */

exports.vote = function vote(id, citizen, value, fn) {
  log('Proceding to vote %s at %s by %s', value, id, citizen);

  Proposal.findById(id, function (err, proposal) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    // Right now, I can only vote once!
    // This should be reverted.
    var voters = proposal.vote.census.addToSet.apply(proposal.vote.census, [citizen]);

    log('Counting %n votes %s', voters.length, value);

    proposal.vote[value].addToSet.apply(proposal.vote[value], voters);

    proposal.save(function (err, saved) {
      if (err) {
        log('Found error %j', err);
        return fn(err);
      };

      log('Delivering proposal %j', saved);
      fn(null, saved);
    });

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
  return source.map(function (item) { return item[property]; });
}