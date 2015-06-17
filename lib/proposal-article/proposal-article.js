import View from '../view/view.js';
import config from '../config/config.js';
import Participants from '../participants-box/view.js';
import ProposalClauses from '../proposal-clauses/proposal-clauses.js';
import template from './template.jade';
import {toHTML} from '../proposal/body-serializer';

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

    let baseUrl = `${config.protocol}://${config.host}${config.publicPort ? (':' + config.publicPort) : ''}`;

    proposal.summary = toHTML(proposal.clauses[0]);
    proposal.body = toHTML(proposal.clauses.slice(1));

    super(template, {
      proposal: proposal,
      baseUrl: baseUrl,
      toHTML: toHTML
    });

    let participants = new Participants(proposal.participants || []);
    participants.appendTo(this.find('.participants')[0]);
    participants.fetch();

    // Enable side-comments
    this.proposalClauses = new ProposalClauses(proposal, reference);
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
}
