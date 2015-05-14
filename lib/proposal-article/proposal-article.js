
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
var wrap = require('wrap');

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

  this.clauses.forEach(function(c) {
    if (isHTML(c.text)) {
      var text = o(c.text);
      var div = text.find('div:first-child');
      div.html((c.clauseName ? c.clauseName + ': ' : '') + div.html());
      var temp = document.createElement('div');
      temp.appendChild(text[0]);
      c.text = temp.innerHTML;
    } else {
      c.text = (c.clauseName ? c.clauseName + ': ' : '') + c.text;
    }
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
  this.renderedClauses = this.find('.clauses');
  this.embedResponsively(this.renderedClauses);

  this.summary = this.find('.summary').html(proposal.summary);
  this.commentable(this.summary, proposal.id);
  this.embedResponsively(this.summary);
  this.truncate(this.find('.summary'));
}

/**
 * Inherit from View
 */

View(ProposalArticle);

/**
 * Turn on event handlers on this view
 */

ProposalArticle.prototype.switchOn = function() {
  this.bind('click', 'a.read-more', 'showclauses');
}

ProposalArticle.prototype.showclauses = function(ev) {
  ev.preventDefault();

  this.find('.clauses .clause.hide').removeClass('hide');
  this.find('.summary div.hide').removeClass('hide');
  this.unbind('click', 'a.read-more', 'showclauses');
  this.find('a.read-more').remove();
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
      var isEmpty = !div.text().trim();
      // Ignore empty divs
      if (isEmpty) return;

      div
        .attr('data-section-id', proposalId + '-' + i)
        .addClass('commentable-section');
    });
  }
}

ProposalArticle.prototype.embedResponsively = function(el) {
  var iframes = el.find('iframe');
  iframes.each(function(iframe) {
    wrap(iframe[0], o('<div class="embed-container"></div>')[0]);
  });
}

ProposalArticle.prototype.truncate = function(el) {
  if (this.clauses && this.clauses.length > 0) return;
  this.find('a.read-more').remove();
}

/**
 * Check if the string is HTML
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/.exec(str);
  return !!(match && match[1]);
}
