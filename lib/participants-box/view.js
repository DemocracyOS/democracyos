import bus from 'bus'
import t from 't-component'
import Participant from '../participant-view/view.js'
import request from '../request/request.js'
import user from '../user/user.js'
import View from '../view/view.js'
import template from './template.jade'
import debug from 'debug'

let log = debug('democracyos:participants-box')

export default class ParticipantsBox extends View {
  constructor (participants) {
    super(template, { participants: participants })
    this.participants = participants
  }

  onvote () {
    let id = user.id
    let ids = this.participants.map((c) => typeof c === 'object' ? c._id : c)

    if (!~ids.indexOf(id)) this.participants.push(id)
    bus.emit('participants:updated', this.participants)
    this.fetch()
  }

  switchOn () {
    this.on('fetch', this.load.bind(this))
    bus.on('vote', this.bound('onvote'))
    this.bind('click', 'a.view-more', 'more')
  }

  fetch () {
    let view = this

    request
      .post('/api/user/lookup')
      .send({ ids: this.participants })
      .end((err, res) => {
        if (err || !res.ok) {
          return log('Fetch error: %s', err || res.error)
        }
        if (res.body && res.body.error) {
          return log('Error: %o', res.body.error)
        }

        view.emit('fetch', res.body || [])
      })
  }

  load (participants) {
    let container = this.find('.participants-container')[0]
    // Remove existent bubbles
    this.find('a.participant-profile', container).remove()

    participants.forEach((p, i) => new Participant(p, i).appendTo(container))

    // Update counter
    let participantsCounter = this.find('.participants-container span')[0]
    let cardinality = participants.length === 1 ? 'singular' : 'plural'
    participantsCounter.innerHTML = participants.length + ' ' + t('proposal-article.participant.' + cardinality)

    // Hellip
    if (participants.length > 5) this.find('a.view-more.hellip').removeClass('hide')
  }

  more (ev) {
    ev.preventDefault()

    var btn = this.find('a.view-more')
    btn.addClass('hide')

    var hiddens = this.find('a.participant-profile.hide') || []
    hiddens.removeClass('hide')
  }
}
