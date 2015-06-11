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
import * as serializer from '../proposal/body-serializer';

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
    proposal.summary = serializer.toHTML(proposal.clauses[0]);
    proposal.body = serializer.toHTML(proposal.clauses.slice(1));

    super(template, {
      proposal: proposal,
      baseUrl: baseUrl,
      truncate: truncate,
      toHTML: serializer.toHTML
    });

    this.proposal = proposal;

    this.participants = new Participants(proposal.participants || []);
    this.participants.appendTo(this.find('.participants')[0]);
    this.participants.fetch();

    this.proposalClauses = new ProposalClauses(proposal, reference);
    this.proposalClauses.appendTo('.clauses');
    this.renderedClauses = this.find('.clauses');
    this.embedResponsively(this.renderedClauses);

    // this.body = this.find('.body').html(proposal.body);
    // this.commentable(this.body, proposal.id);
    // this.embedResponsively(this.body);
    // this.truncate(this.find('.body'));
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
    this.find('.body div.hide').removeClass('hide');
    this.unbind('click', 'a.read-more', 'showclauses');
    this.find('a.read-more').remove();
  }

  commentable (els, proposalId) {
    let divs = els.find('div, li');

    if (!divs || !divs.length) {
      // Old-fashioned topic format
      var paragraphs = els.html().split('\n');
      els.html('');
      paragraphs.forEach((text, index) => els.append(dom(paragraph, { proposalId: proposalId, i: index, text: text })));
    } else {
      // New topic format
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
