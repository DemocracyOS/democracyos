/**
 * Module dependencies.
 */

var template = require('./template');
var tip = require('tip');
var View = require('view');

/**
 * Expose View
 */

module.exports = Participant;

/**
 * Participants View Class
 *
 * @param {Array} participants array of ids
 * @api public
 */

function Participant(participant, index) {
  if (!(this instanceof Participant)) {
    return new Participant(participant, index);
  };

  this.participant = participant;
  this.index = index;
  View.call(this, template, { participant: participant, index: index });
}

View(Participant);

Participant.prototype.switchOn = function() {
  tip(this.el[0]);
}