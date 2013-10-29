/**
 * Module dependencies.
 */

var request = require('request');
var events = require('events');
var classes = require('classes');
var Emitter = require('emitter');
var participant = require('./participant');
var box = require('./box');
var render = require('render');
var tip = require('tip')
var o = require('query');
var log = require('debug')('democracyos:participants-view');

/**
 * Expose View
 */

module.exports = View;

/**
 * Participants View Class
 *
 * @param {Array} participants array of ids
 * @api public
 */

function View(participants) {
  if (!(this instanceof View)) {
    return new View(participants);
  };

  this.participants = participants;
  this.el = render.dom(box, { participants: participants });
  this.events = events(this.el, this);
  this.switchOn();
}

Emitter(View.prototype);

View.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  this.events.bind('click a.view-more', 'more');
}

View.prototype.switchOff = function() {
  this.off('fetch');
  this.events.unbind();
}

View.prototype.destroy = function() {
  // Detach el from DOM
  this.switchOff();
}

View.prototype.fetch = function() {
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

View.prototype.load = function(participants) {
  participants.forEach(function(p, i) {
    var el = render.dom(participant, { participant: p, index: i});
    this.add(el);
  }, this);
}

View.prototype.add = function(p) {
  var after = o('.view-more', this.el);
  after.parentNode.insertBefore(p, after);
  tip(p);
}

View.prototype.more = function(ev) {
  ev.preventDefault();

  var btn = o('a.view-more', this.el);
  classes(btn).add('hide');

  var hiddens = o.all('a.participant-profile.hide', this.el) || [];
  for (var i = 0, h = hiddens[i]; i < hiddens.length; i++, h = hiddens[i]) {
    classes(h).remove('hide');
  }
}

View.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}