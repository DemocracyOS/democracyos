/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Proposal = mongoose.model('Proposal')
  , tag = require('lib/tag')
  , log = require('debug')('proposal');

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

    log('Delivering proposals %j', proposals.map(function(proposal) { return proposal.id; }));
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

  tag.create(proposal.tag, function (err, t) {
    proposal.tag = t;
    (new Proposal(proposal)).save(function (err, saved) {
      if (err) {
        log('Found error %j', err);

        return fn(err);
      };

      log('Delivering proposal %j', saved);
      fn(null, saved);
    });
  })

  return this;
};
