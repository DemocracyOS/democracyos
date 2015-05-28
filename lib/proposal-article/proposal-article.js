import o from 'component-dom';
import wrap from 'wrap';
import truncate from 'truncate';
import View from '../view/view.js';
import { dom } from '../render/render.js';
import config from '../config/config.js';
import Participants from '../participants-box/view.js';
import ProposalClauses from '../proposal-clauses/proposal-clauses.js';
import template from './template.jade';
import paragraph from './paragraph.jade';

export default class ProposalArticle extends View {

  /**
   * Creates a new proposal-article view
   * from proposals object.
   *
   * @param {Object} proposal proposal's object data
   * @return {ProposalArticle} `ProposalArticle` instance.
   * @api public
   */

  constructor (proposal, reference) {
    super();

    let baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");

    super(template, {
      proposal: proposal,
      clauses: proposal.clauses.sort((a, b) => a.order - b.order > 0 ? 1 : -1),
      baseUrl: baseUrl,
      truncate: truncate
    });

    this.proposal = proposal;
    this.clauses = proposal.clauses.sort((a, b) => a.order - b.order > 0 ? 1 : -1);

    this.clauses.forEach((c) => {
      if (isHTML(c.text)) {
        let text = o(c.text);
        let div = text.find('div:first-child');
        div.html((c.clauseName ? c.clauseName + ': ' : '') + div.html());
        let temp = document.createElement('div');
        temp.appendChild(text[0]);
        c.text = temp.innerHTML;
      } else {
        c.text = (c.clauseName ? c.clauseName + ': ' : '') + c.text;
      }
    });

    this.participants = new Participants(proposal.participants || []);
    this.participants.appendTo(this.find('.participants')[0]);
    this.participants.fetch();

    this.proposalClauses = new ProposalClauses(proposal, reference);
    this.proposalClauses.appendTo('.clauses');
    this.renderedClauses = this.find('.clauses');
    this.embedResponsively(this.renderedClauses);

    this.summary = this.find('.summary').html(proposal.summary);
    this.commentable(this.summary, proposal.id);
    this.embedResponsively(this.summary);
    this.truncate(this.find('.summary'));
  }

  /**
   * Turn on event handlers on this view
   */

  switchOn () {
    this.bind('click', 'a.read-more', 'showclauses');
  }

  showclauses (ev) {
    ev.preventDefault();

    this.find('.clauses .clause.hide').removeClass('hide');
    this.find('.summary div.hide').removeClass('hide');
    this.unbind('click', 'a.read-more', 'showclauses');
    this.find('a.read-more').remove();
  }

  commentable (els, proposalId) {
    let divs = els.find('div');

    if (!divs || divs.length === 0) {
      // Old-fashioned law format
      var paragraphs = els.html().split('\n');
      els.html('');
      paragraphs.forEach((text, index) => els.append(dom(paragraph, { proposalId: proposalId, i: index, text: text })));
    } else {
      // New law format
      divs.each((div, i) => {
        var isEmpty = !div.text().trim();
        // Ignore empty divs
        if (isEmpty) return;

        div
          .attr('data-section-id', proposalId + '-' + i)
          .addClass('commentable-section');
      });
    }
  }

  embedResponsively (el) {
    var iframes = el.find('iframe');
    iframes.each((iframe) => wrap(iframe[0], o('<div class="embed-container"></div>')[0]));
  }

  truncate (el) {
    if (this.clauses && this.clauses.length > 0) return;
    this.find('a.read-more').remove();
  }
}


/**
 * Check if the string is HTML
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

let isHTML = (str) => {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/.exec(str);
  return !!(match && match[1]);
}
