/**
 * Module dependencies.
 */

var domify = require('domify')
  , list = require('./list');

/**
 * Expose ProposalList.
 */

module.exports = ProposalList;

/**
 * Proposal List view
 *
 * @param {Array} proposals list of proposals
 * @param {Object} selected proposal object
 * @return {ProposalList} `ProposalList` instance.
 * @api public
 */

function ProposalList (proposals, selected) {
  if (!(this instanceof ProposalList)) {
    return new ProposalList(proposals);
  }

  this.proposals = proposals;
  this.list = domify(list({ proposals: proposals, proposal: selected }))[0];

}

/**
 * Render list
 *
 * @return {NodeElement} proposals list
 * @api public
 */

ProposalList.prototype.render = function() {
  return this.list;
}