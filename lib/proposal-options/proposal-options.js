/**
 * Module dependencies.
 */

var page = require('page')
  , domify = require('domify')
  , t = require('t')
  , events = require('events')
  , classes = require('classes')
  , request = require('superagent')
  , options = require('./options')
  , closest = require('closest')
  , autocomplete = require('autocomplete')
  , Enumerable = require('enumerable')
  , Chart = require('Chart.js')
  , log = require('debug')('proposal-options');

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
  this.options = domify(options({ proposal: proposal, citizen: citizen, t: t }));
  this.events = events(this.options, this);
  
  this.events.bind('click .vote-box .direct-vote .vote-option', 'vote');
  //UNDONE: this.events.bind('click .vote-box .proxy-vote .vote-option', 'proxy');
  this.events.bind('click .vote-box .meta-data .change-vote', 'changevote');
  this.events.bind('click .toggle-results', 'toggleresults');

  this.buttonsBox = this.options.querySelector('.vote-box .vote-options');
  this.delegationBox = this.options.querySelector('.vote-box .delegation-box');

  this.delegationInput = this.options.querySelector('.vote-box .delegation-box .delegation-input');
  //UNDONE: this.initializeAutocomplete(this.delegationInput);
}

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
    , id = target.getAttribute('data-proposal')
    , value;

  if (classes(target).has('vote-no')) {
    value = 'negative';
  } else if (classes(target).has('vote-yes')) {
    value = 'positive';
  } else if (classes(target).has('vote-abstain')) {
    value = 'neutral';
  }

  log('casting vote %s for %s', value, id);
  this.post(
    '/api/law/:id/vote'.replace(':id', id),
    { value: value },
    function (err, res) {
      if (err || !res.ok) {
        log('Failed cast %s for %s with error: %j', value, id, err || res.error);
        return;
      };

      page(window.location.pathname)
    }
  );
}

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
  .set('Accept', 'application/json')
  .send(payload)
  .end(fn);
};

/**
 * Render options
 *
 * @return {NodeElement} proposals options
 * @api public
 */

ProposalOptions.prototype.render = function() {
  // this.renderChart(); UNDONE: from previous layout; was breaking rendering
  return this.options;
}

ProposalOptions.prototype.initializeAutocomplete = function(input) {
  var self = this;
  var me = this.citizen;

  autocomplete(input, '/api/citizen/search?q=:q', {accept: 'application/json'})
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
    function(res) { 
      log('delegation response: %j',res);
      page(window.location.pathname);
    }
  );
};

/**
 * Toggle results box
 *
 * @param {Event} ev
 * @api private
 */

ProposalOptions.prototype.toggleresults = function(ev) {
  ev.preventDefault();

  classes(this.options.querySelector('.results-box')).toggle('hide');
};

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 * @deprecated
 */

ProposalOptions.prototype.renderChart = function() {
  var container = this.options.querySelector('#vote-chart');
  var vote = this.proposal.vote;
  var data = [];

  if (vote.census.length) {
    data.push({
      value: vote.positive.length,
      color: "#a4cb53",
      label: "YES",
      labelColor: "white",
      labelAlign: "center"
    });
    data.push({
      value: vote.negative.length,
      color: "#d95e59",
      label: "NO",
      labelColor: "white",
      labelAlign: "center"
    });

    new Chart(container.getContext('2d')).Pie(data);
  } else {
    var p = document.createElement('p');
    p.classList.add('alert');
    p.classList.add('alert-info');
    p.innerHTML = "No voting yet."
    container.parentNode.insertBefore(p, container);
  }
}