import View from '../view/view';
import Participants from '../participants-box/view';
import ProposalClauses from '../proposal-clauses/proposal-clauses';
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

  constructor (proposal) {
    super();

    super(template, {
      proposal: proposal,
      baseUrl: window.location.origin,
      toHTML: toHTML
    });

    let participants = new Participants(proposal.participants || []);
    participants.appendTo(this.find('.participants')[0]);
    participants.fetch();

    // Enable side-comments
    this.proposalClauses = new ProposalClauses(proposal);
  }
}
