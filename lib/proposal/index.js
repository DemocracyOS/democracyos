/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Proposal = mongoose.model('Proposal')
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

exports.all = function all() {
  log('Looking for all proposals.')

  Proposal.find(function (err, proposals))

}