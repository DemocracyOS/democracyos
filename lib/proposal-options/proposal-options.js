/**
 * Module dependencies.
 */

var bus = require('bus');
var closest = require('closest');
var citizen = require('citizen');
var request = require('request');
var template = require('./template');
var Chart = require('Chart.js');
var t = require('t');
var render = require('render');
var positive = require('./vote-positive');
var negative = require('./vote-negative');
var neutral = require('./vote-neutral');
var o = require('dom');
var View = require('view');
var log = require('debug')('democracyos:proposal-options');

/**
 * Expose ProposalOptions.
 */

module.exports = ProposalOptions;

/**
 * Proposal Options view
 *
 * @param {Array} proposals list of proposals
 * @param {Object} selected proposal object
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 */

function ProposalOptions (proposal) {
  if (!(this instanceof ProposalOptions)) {
    return new ProposalOptions(proposal);
  }

  View.call(this, template, { proposal: proposal });

  this.proposal = proposal;

  this.bind('click', '.vote-box .direct-vote .vote-option', 'vote');
  this.bind('click', '.vote-box .meta-data .change-vote', 'changevote');

  this.on('vote', this.onvote.bind(this));
  this.on('voting', this.onvoting.bind(this));
  this.on('voteerror', this.onvoteerror.bind(this));

  this.buttonsBox = this.find('.vote-box .vote-options');

  this.renderChart();
}

/**
 * Inherit from View
 */

View(ProposalOptions);

/**
 * Vote for option
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.vote = function(ev) {
  var self = this;
  var value;
  var id = this.proposal.id;

  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-proposal]')
  if (o(target).hasClass('vote-no')) {
    value = 'negative';
  } else if (o(target).hasClass('vote-yes')) {
    value = 'positive';
  } else if (o(target).hasClass('vote-abstain')) {
    value = 'neutral';
  }

  if (citizen.id) {
    log('casting vote %s for %s', value, id);
    this.emit('voting', value);
    this.post(
      '/api/law/:id/vote'.replace(':id', id),
      { value: value },
      function (err, res) {
        if (err || !res.ok) {
          self.emit('voteerror', value);
          return log('Failed cast %s for %s with error: %j', value, id, err || res.error);
        }

        bus.emit('vote', id, value);
        self.emit('vote', value);
      }
    );
  } else {
    this.find('.proposal-options p.text-mute').removeClass('hide');
  }
}

ProposalOptions.prototype.onvoting = function(value) {

  this.find('#voting-error').addClass('hide');
  this.find('.vote-options').addClass('hide');
  this.find('a.meta-item').addClass('hide');

  var el;

  this.unvote();

  switch (value) {
    case 'negative':
      this.proposal.downvotes.push(citizen.id);
      el = render.dom(negative);
      break;
    case 'positive':
      this.proposal.upvotes.push(citizen.id);
      el = render.dom(positive);
      break;
    case 'neutral':
      this.proposal.abstentions.push(citizen.id);
      el = render.dom(neutral);
      break;
  }

  var meta = this.find('.meta-data');

  meta.find('.alert').remove();

  //TODO: clear this of array handling when `dom` supports `insertBefore`
  meta[0].insertBefore(el, meta[0].firstChild);
}

ProposalOptions.prototype.onvoteerror = function(value) {
  this.find('.change-vote').addClass('hide');
  this.find('.vote-options').removeClass('hide');
  this.find('#voting-error').removeClass('hide');

  this.find('.meta-data').find('.alert').remove();
}

ProposalOptions.prototype.onvote = function(value) {

  this.find('.change-vote').removeClass('hide');

  var cast = this.find('.votes-cast em');

  var upvotes = this.proposal.upvotes || [];
  var downvotes = this.proposal.downvotes || [];
  var abstentions = this.proposal.abstentions || [];
  var census = abstentions.concat(downvotes).concat(upvotes) || [];

  cast.html(t(t('{num} votes cast', { num: census.length || "0" })));
}

ProposalOptions.prototype.unvote = function() {
  if (~this.proposal.upvotes.indexOf(citizen.id)) {
    this.proposal.upvotes.splice(citizen.id, 1);
  }
  if (~this.proposal.downvotes.indexOf(citizen.id)) {
    this.proposal.downvotes.splice(citizen.id, 1);
  }
  if (~this.proposal.abstentions.indexOf(citizen.id)) {
    this.proposal.abstentions.splice(citizen.id, 1);
  }
};

/**
 * Change vote
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.changevote = function(ev) {
  ev.preventDefault();

  this.buttonsBox.toggleClass('hide');
};

ProposalOptions.prototype.post = function(path, payload, fn) {
  request
  .post(path)
  .send(payload)
  .end(fn);
};

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

ProposalOptions.prototype.renderChart = function() {
  var container = this.find('#results-chart');
  var upvotes = this.proposal.upvotes || [];
  var downvotes = this.proposal.downvotes || [];
  var abstentions = this.proposal.abstentions || [];
  var census = abstentions.concat(downvotes).concat(upvotes);
  var data = [];

  if (!container.length) return;

  if (census.length) {
    data.push({
      value: upvotes.length,
      color: "#a4cb53",
      label: t('Yea'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: abstentions.length,
      color: "#666666",
      label: t('Abstain'),
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: downvotes.length,
      color: "#d95e59",
      label: t('Nay'),
      labelColor: "white",
      labelAlign: "center"
    });

    new Chart(container[0].getContext('2d')).Pie(data, { animation: false });
  }
}