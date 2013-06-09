/**
 * Module dependencies.
 */

var domify = require('domify')
  , comments = require('./comments');

/**
 * Expose ProposalComments.
 */

module.exports = ProposalComments;

/**
 * Proposal Comments view
 *
 * @param {Object} proposal for comments query
 * @param {Array} replies comments replied
 * @return {ProposalComments} `ProposalComments` instance.
 * @api public
 */

function ProposalComments (proposal, replies) {
  if (!(this instanceof ProposalComments)) {
    return new ProposalComments(proposal);
  };

  this.proposal = proposal;
  this.comments = domify(comments({ proposal: proposal, comments: replies }))[0];

}

/**
 * Render proposal comments
 * 
 * @return {ProposalComments} `ProposalComments` instance.
 * @api public
 */

ProposalComments.prototype.render = function() {
  return this.comments;
}

