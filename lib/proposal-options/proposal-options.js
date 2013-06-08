/**
 * Module dependencies.
 */

var domify = require('domify')
  , options = require('./options');

/**
 * Expose ProposalOptions.
 */

module.exports = ProposalOptions;

/**
 * Proposal Options view
 *
 * @param {Array} proposals list of proposals
 * @param {Object} selected proposal object
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 */

function ProposalOptions (proposal, citizen) {
  if (!(this instanceof ProposalOptions)) {
    return new ProposalOptions(proposals);
  }

  this.proposal = proposal;
  this.citizen = citizen;
  this.options = domify(options({ proposal: proposal, citizen: citizen }))[0];

}

/**
 * Render options
 *
 * @return {NodeElement} proposals options
 * @api public
 */

ProposalOptions.prototype.render = function() {
  return this.options;
}