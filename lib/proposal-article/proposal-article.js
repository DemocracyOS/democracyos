/**
 * Module dependencies.
 */

var domify = require('domify')
  , article = require('./article')
  , toArray = require('to-array')
  , Tip = require('tip')
  , config = require('config')
  , t = require('t');

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
  var baseUrl = config.host + (config.host=="localhost" ? (":" + config.port) : "");
  this.el = domify(article({ proposal: proposal, baseUrl: baseUrl, t: t }));

  toArray(this.el.querySelectorAll('.participant-profile'))
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

ProposalArticle.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = document.querySelector(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}

/**
 * Append view to article
 *
 * @param {Element} el
 * @return {Element} a prosal's article
 * @api public
 */

ProposalArticle.prototype.append = function(el) {
  this.el.appendChild(el);
  return this;
}