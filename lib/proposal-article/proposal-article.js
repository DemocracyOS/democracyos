/**
 * Module dependencies.
 */

var domify = require('domify')
  , article = require('./article')
  , toArray = require('to-array')
  , Tip = require('tip');

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
  this.article = domify(article({ proposal: proposal }));

  toArray(this.article.querySelectorAll('.participant-profile'))
  .forEach(function(el) {
    Tip(el);
  });
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