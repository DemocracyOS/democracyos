import View from '../../view/view.js'
import Participants from '../participants-box/view.js'
import ProposalClauses from '../proposal-clauses/proposal-clauses.js'
import template from './template.jade'
import { toHTML } from '../../proposal/body-serializer'

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
    super(template, {
      proposal: proposal,
      baseUrl: window.location.origin,
      toHTML: toHTML
    })

    this.topic = proposal

    let participants = new Participants(proposal.participants || [])
    participants.appendTo(this.find('.participants')[0])
    participants.fetch()

    // Enable side-comments
    this.proposalClauses = new ProposalClauses(proposal)

    this.trackLinkClick()
  }

  trackLinkClick () {
    const el = this.el[0]
    const links = el.querySelectorAll('[data-topic-link]')

    Array.prototype.forEach.call(links, (link) => {
      link.addEventListener('click', () => {
        window.analytics.track('topic link click', {
          link: link.getAttribute('href'),
          topic: this.topic.id
        })
      })
    })
  }
}
