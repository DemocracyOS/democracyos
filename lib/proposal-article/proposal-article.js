
/**
 * Module dependencies.
 */

var View = require('view');
var render = require('render');
var template = require('./template');
var paragraph = require('./paragraph');
var truncate = require('truncate');
var config = require('config');
var Participants = require('participants-box');
var ProposalClauses = require('proposal-clauses');
var o = require('dom');

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
  this.clauses = proposal.clauses.sort(function(a, b) {
    var sort = a.order - b.order;
    sort = sort > 0 ? 1 : -1;
    return sort;
  });

  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");

  View.call(this, template, {
    proposal: proposal,
    clauses: this.clauses,
    baseUrl: baseUrl,
    truncate: truncate
  });


  this.participants = new Participants(proposal.participants || []);
  this.participants.appendTo(this.find('.participants')[0]);
  this.participants.fetch();

  this.proposalClauses = new ProposalClauses(proposal);
  this.proposalClauses.appendTo('.clauses');

  this.summary = this.find('.summary').html(proposal.summary);
  this.commentable(this.summary, proposal.id);
}

/**
 * Inherit from View
 */

View(ProposalArticle);

/**
 * Turn on event handlers on this view
 */

ProposalArticle.prototype.switchOn = function() {
  this.bind('click', '.clauses a.read-more', 'showclauses');
}

ProposalArticle.prototype.showclauses = function(ev) {
  ev.preventDefault();

  this.find('.clauses .clause.hide').removeClass('hide');
  this.unbind('click', '.clauses a.read-more', 'showclauses');
  this.find('.clauses a.read-more').remove();
}

ProposalArticle.prototype.commentable = function(els, proposalId) {
  var divs = els.find('div');

  if (!divs || divs.length === 0) {
    // Old-fashioned law format
    var paragraphs = els.html().split('\n');
    els.html('');
    paragraphs.forEach(function(text, index) {
      els.append(render.dom(paragraph, { proposalId: proposalId, i: index, text: text }));
    });
  } else {
    // New law format
    divs.each(function(div, i) {
      div
        .attr('data-section-id', proposalId + '-' + i)
        .addClass('commentable-section');
    });
  }
}
