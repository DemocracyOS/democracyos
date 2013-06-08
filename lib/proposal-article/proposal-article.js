/**
 * Module dependencies.
 */

var domify = require('domify')
  , article = require('./article')

/**
 * Expose ProposalArticle
 */
module.exports = ProposalArticle;

/**
 * Creates a new proposal-article view
 * from proposals object.
 *
 * @param {Object} proposal proposal's object data
 * @return {ProposalArticle} `ProposalArticle` instance.
 * @api public
 */

function ProposalArticle (proposal) {
  if (!(this instanceof ProposalArticle)) {
    return new ProposalArticle(proposal);
  };

  this.proposal = proposal;
  this.article = domify(article({ proposal: proposal }))[0];
}

/**
 * Render
 *
 * @return {NodeElement} a prosal's article
 * @api public
 */

ProposalArticle.prototype.render = function() {
  return this.article;
}
