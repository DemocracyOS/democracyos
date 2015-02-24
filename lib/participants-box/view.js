/**
 * Module dependencies.
 */

var Participant = require('participant-view');
var request = require('request');
var template = require('./template');
var bus = require('bus');
var t = require('t');
var citizen = require('citizen');
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

ParticipantsBox.prototype.onvote = function() {
  var id = citizen.id;
  var ids = this.participants.map(function(c) { return 'object' === typeof c ? c._id : c; });

  if (!~ids.indexOf(id)) this.participants.push(id);
  bus.emit('participants:updated', this.participants);
  this.fetch();
}

ParticipantsBox.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  bus.on('vote', this.bound('onvote'));
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
  var container = this.find('.participants-container')[0];
  // Remove existent bubbles
  this.find('a.participant-profile', container).remove();

  participants.forEach(function(p, i) {
    var participant = new Participant(p, i);
    participant.appendTo(container);
  }, this);

  // Update counter
  participantsCounter = this.find('.participants-container span')[0];
  var cardinality = 1 === participants.length ? 'singular' : 'plural';
  participantsCounter.innerHTML = participants.length + ' ' + t('proposal-article.participant.' + cardinality);

  // Hellip
  if (participants.length > 5)
    this.find('a.view-more.hellip').removeClass('hide');
}

ParticipantsBox.prototype.more = function(ev) {
  ev.preventDefault();

  var btn = this.find('a.view-more');
  btn.addClass('hide');

  var hiddens = this.find('a.participant-profile.hide') || [];
  hiddens.removeClass('hide');
}