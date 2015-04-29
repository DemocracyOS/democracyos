import bus from 'bus';
import t from 't-component';
import Participant from '../participant-view/view.js';
import request from '../request/request.js';
import citizen from '../citizen/citizen.js';
import View from '../view/view.js';
import template from './template.jade';

export default class ParticipantsBox extends View {
  constructor (participants) {
    super(template, { participants: participants });
    this.participants = participants;
  }

  onvote () {
    let id = citizen.id;
    let ids = this.participants.map((c) => 'object' === typeof c ? c._id : c);

    if (!~ids.indexOf(id)) this.participants.push(id);
    bus.emit('participants:updated', this.participants);
    this.fetch();
  }

  switchOn () {
    this.on('fetch', this.load.bind(this));
    bus.on('vote', this.bound('onvote'));
    this.bind('click', 'a.view-more', 'more');
  }

  fetch () {
    let view = this;

    request
    .post('/api/citizen/lookup')
    .send({ ids: this.participants })
    .end((err, res) => {
      if (err || !res.ok) {
        return log('Fetch error: %s', err || res.error);
      };
      if (res.body && res.body.error) {
        return log('Error: %o', res.body.error);
      };

      view.emit('fetch', res.body || []);
    });
  }

  load (participants) {
    let container = this.find('.participants-container')[0];
    // Remove existent bubbles
    this.find('a.participant-profile', container).remove();

    participants.forEach((p, i) => {
      let participant = new Participant(p, i);
      participant.appendTo(container);
    }, this);

    // Update counter
    participantsCounter = this.find('.participants-container span')[0];
    var cardinality = 1 === participants.length ? 'singular' : 'plural';
    participantsCounter.innerHTML = participants.length + ' ' + t('proposal-article.participant.' + cardinality);

    // Hellip
    if (participants.length > 5) this.find('a.view-more.hellip').removeClass('hide');
  }

  more (ev) {
    ev.preventDefault();

    var btn = this.find('a.view-more');
    btn.addClass('hide');

    var hiddens = this.find('a.participant-profile.hide') || [];
    hiddens.removeClass('hide');
  }
}
