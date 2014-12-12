/**
 * Module dependencies.
 */

var Participant = require('participant-view');
var request = require('request');
var bus = require('bus');
var citizen = require('citizen');
var indexOf = require('indexof');
var template = require('./template');
var t = require('t');
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

function onvote() {
  var id = citizen.id;
  var ids = this.participants.map(function(c) { return 'object' === typeof c ? c._id : c; });

  if (!~ids.indexOf(id)) this.participants.push(id);
  this.fetch();
}

ParticipantsBox.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  bus.on('vote', onvote.bind(this));
  this.bind('click', 'a.view-more', 'more');
}

ParticipantsBox.prototype.switchOff = function() {
  this.off('fetch');
  bus.off('vote', this.bound('onvote'));
  this.unbind('click', 'a.view-more', 'more');
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
  // NOTE: The following code may override template logic

  // Remove all balloons
  this.find('.participants-container a.participant-profile').remove();

  // Add them again
  participants.forEach(function(p, i) {
    var participant = new Participant(p, i);
    participant.appendTo(this.find('.participants-container')[0]);
  }, this);

  // Update counter
  participantsCounter = this.find('.participants-container span')[0];
  var cardinality = 1 === participants.length ? 'singular' : 'plural';
  participantsCounter.innerHTML = participants.length + ' ' + t('Participant.' + cardinality);

  // Hellip
  if (participants.length > 5)
    this.find('a.view-more.hellip')[0].classList.remove('hide');
}

ParticipantsBox.prototype.more = function(ev) {
  ev.preventDefault();

  var btn = this.find('a.view-more');
  btn.addClass('hide');

  var hiddens = this.find('a.participant-profile.hide') || [];
  hiddens.removeClass('hide');
}