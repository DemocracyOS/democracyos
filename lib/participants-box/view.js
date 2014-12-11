/**
 * Module dependencies.
 */

var Participant = require('participant-view');
var request = require('request');
var template = require('./template');
var View = require('view');

module.exports = ParticipantsBox;

function ParticipantsBox(participants) {
  if (!(this instanceof ParticipantsBox)) {
    return new ParticipantsBox(participants);
  };

  View.call(this, template, { participants: participants });
  this.participants = participants;
}

/**
 * Inherit from View
 */

View(ParticipantsBox);

ParticipantsBox.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  this.bind('click', 'a.view-more', 'more');
}

ParticipantsBox.prototype.fetch = function() {
  var view = this;

  request
  .post('/api/citizen/lookup')
  .send({ ids: this.participants })
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %s', err || res.error);
    };
    if (res.body && res.body.error) {
      return log('Error: %o', res.body.error);
    };

    view.emit('fetch', res.body || []);
  });
}

ParticipantsBox.prototype.load = function(participants) {
  participants.forEach(function(p, i) {
    var participant = new Participant(p, i);
    participant.appendTo(this.find('.participants-container')[0]);
  }, this);
}

ParticipantsBox.prototype.more = function(ev) {
  ev.preventDefault();

  var btn = this.find('a.view-more');
  btn.addClass('hide');

  var hiddens = this.find('a.participant-profile.hide') || [];
  hiddens.removeClass('hide');
}