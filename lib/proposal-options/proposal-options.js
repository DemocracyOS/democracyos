/**
 * Module dependencies.
 */

var page = require('page');
var domify = require('domify');
var events = require('events');
var bus = require('bus');
var classes = require('classes');
var request = require('request');
var Emitter = require('emitter');
var options = require('./options');
var closest = require('closest');
var autocomplete = require('autocomplete');
var Enumerable = require('enumerable');
var Chart = require('Chart.js');
var o = require('query');
var t = require('t');
var render = require('render');
var positive = require('./vote-positive');
var negative = require('./vote-negative');
var neutral = require('./vote-neutral');
var log = require('debug')('democracyos:proposal-options');

/**
 * Expose ProposalOptions.
 */

module.exports = ProposalOptions;

var buttonsBox = delegationBox = null;


/**
 * Proposal Options view
 *
 * @param {Array} proposals list of proposals
 * @param {Object} selected proposal object
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 */

function ProposalOptions (proposal, citizen) {
  if (!(this instanceof ProposalOptions)) {
    return new ProposalOptions(proposals);
  }

  this.proposal = proposal;
  this.citizen = citizen;
  this.el = domify(options({ proposal: proposal, citizen: citizen, t: t }));
  this.events = events(this.el, this);
  
  this.events.bind('click .vote-box .direct-vote .vote-option', 'vote');
  //UNDONE: this.events.bind('click .vote-box .proxy-vote .vote-option', 'proxy');
  this.events.bind('click .vote-box .meta-data .change-vote', 'changevote');
  this.on('vote', this.onvote.bind(this));

  this.buttonsBox = o('.vote-box .vote-options', this.el);
  this.delegationBox = o('.vote-box .delegation-box', this.el);

  this.delegationInput = o('.vote-box .delegation-box .delegation-input', this.el);
  //UNDONE: this.initializeAutocomplete(this.delegationInput);
  this.renderChart();
}

/**
 * Mixin with `Emitter`
 */

Emitter(ProposalOptions.prototype);

/**
 * Toggle voting buttons
 *
 * @param {Object} toggle element whose visibility is to be toggled
 * @return {ProposalOptions} instance of `ProposalOptions`
 * @api public
 */

ProposalOptions.prototype.toggleVisibility = function(el) {
  classes(el).toggle('hide');
}

/**
 * Vote for option
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.vote = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-proposal]')
  var id = target.getAttribute('data-proposal');
  var self = this;
  var value;

  if (classes(target).has('vote-no')) {
    value = 'negative';
  } else if (classes(target).has('vote-yes')) {
    value = 'positive';
  } else if (classes(target).has('vote-abstain')) {
    value = 'neutral';
  }

  if (this.citizen.id) {
    log('casting vote %s for %s', value, id);
    this.post(
      '/api/law/:id/vote'.replace(':id', id),
      { value: value },
      function (err, res) {
        if (err || !res.ok) return log('Failed cast %s for %s with error: %j', value, id, err || res.error);
        bus.emit('vote', id, value);
        self.emit('vote', value);
      }
    );    
  } else {
    classes(o('.proposal-options p.text-mute', this.el)).remove('hide');
  }
}

ProposalOptions.prototype.onvote = function(value) {
  classes(o('.vote-options', this.el)).add('hide');
  var meta = o('.meta-data', this.el);
  var item = o('a.meta-item', this.el);
  classes(item).remove('hide');
  var el;
  
  this.unvote();
  
  switch (value) {
    case 'negative':
      this.proposal.downvotes.push(this.citizen.id);
      el = render.dom(negative);
      break;
    case 'positive':
      this.proposal.upvotes.push(this.citizen.id);
      el = render.dom(positive);
      break;
    case 'neutral':
      this.proposal.abstentions.push(this.citizen.id);
      el = render.dom(neutral);
      break;
  }
  var alert = o('.alert', meta);
  if (alert) {
    meta.removeChild(alert);
  }
  meta.insertBefore(el, meta.firstChild);
  var cast = o('.votes-cast em', this.el);
  var upvotes = this.proposal.upvotes || [];
  var downvotes = this.proposal.downvotes || [];
  var abstentions = this.proposal.abstentions || [];
  var census = abstentions.concat(downvotes).concat(upvotes) || [];
  cast.innerHTML = t(t('{num} votes cast', { num: census.length || "0" }))
}

ProposalOptions.prototype.unvote = function() {
  if (~this.proposal.upvotes.indexOf(this.citizen.id)) {
    this.proposal.upvotes.splice(this.citizen.id, 1);
  }
  if (~this.proposal.downvotes.indexOf(this.citizen.id)) {
    this.proposal.downvotes.splice(this.citizen.id, 1);
  }
  if (~this.proposal.abstentions.indexOf(this.citizen.id)) {
    this.proposal.abstentions.splice(this.citizen.id, 1);
  }
};

/**
 * Event handler for clicking the delegation button
 * @param  {Object} ev event
 * @return {ProposalOptions}    instance of `ProposalOptions`
 * @api private
 */

ProposalOptions.prototype.proxy = function(ev) {
  ev.preventDefault();

  this.toggleVisibility(this.buttonsBox);
  this.toggleVisibility(this.delegationBox);
}

/**
 * Change vote
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.changevote = function(ev) {
  ev.preventDefault();

  classes(this.buttonsBox).toggle('hide');
};

ProposalOptions.prototype.post = function(path, payload, fn) {
  request
  .post(path)
  .send(payload)
  .end(fn);
};

/**
 * Render options
 *
 * @return {NodeElement} proposals options
 * @api public
 */

ProposalOptions.prototype.render = function(el) {
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

ProposalOptions.prototype.initializeAutocomplete = function(input) {
  var self = this;
  var me = this.citizen;

  autocomplete(input, '/api/citizen/search?q=:q', { accept: 'application/json' })
  .label('fullName')
  .value('id')
  .parse(function(data){
    return Enumerable(data).reject('id == "' + me.id + '"').value();
  })
  .format(function(label, q) {
    //Format results displayed in select-box
    var r = new RegExp('(?:' + q + ')', 'i');
    return label.replace(r, '<span class="highlight">$&</span>');
  })
  .on('select', function(trusteeId) {
    log('autocomplete - selected %s', trusteeId);
    self.delegateVote(trusteeId);
  })
};

/**
 * Posts a new delegation
 * 
 * @param  {String} trusteeId ID of the delegation's trustee
 * @return {ProposalOptions} instance of `ProposalOptions`
 * @api private
 */

ProposalOptions.prototype.delegateVote = function(trusteeId) {
  var payload = { tag: this.proposal.tag, tid: trusteeId };

  log('delegation payload: %j',payload);

  this.post(
    '/api/delegation/create',
    payload,
    function(err, res) { 
      log('delegation response: %j', res);
      page(window.location.pathname);
    }
  );
};

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

ProposalOptions.prototype.renderChart = function() {
  var container = o('#results-chart', this.el);
  var upvotes = this.proposal.upvotes || [];
  var downvotes = this.proposal.downvotes || [];
  var abstentions = this.proposal.abstentions || [];
  var census = abstentions.concat(downvotes).concat(upvotes);
  var data = [];

  if (!container) return;

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

    new Chart(container.getContext('2d')).Pie(data, { animation: false });
  }
}