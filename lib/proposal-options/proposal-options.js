/**
 * Module dependencies.
 */

var domify = require('domify')
  , delegates = require('delegates')
  , classes = require('classes')
  , request = require('superagent')
  , options = require('./options')
  , Chart = require('Chart.js');

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

function ProposalOptions (proposal, citizen) {
  if (!(this instanceof ProposalOptions)) {
    return new ProposalOptions(proposals);
  }

  this.proposal = proposal;
  this.citizen = citizen;
  this.options = domify(options({ proposal: proposal, citizen: citizen }));
  this.events = delegates(this.options, this);
  this.events.bind('click a.change-vote small', 'showvote');
  this.events.bind('click .vote-box .vote-option span', 'vote');
}

/**
 * Show voting options
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.showvote = function(ev) {
  ev.preventDefault();

  var voteOptions = this.options.querySelector('.vote-box .vote-options');
  var voteChange = this.options.querySelector('a.change-vote');

  classes(voteOptions).toggle('hide', false);
  classes(voteChange).toggle('hide', true);
}

/**
 * Vote for option
 *
 * @param {Object} ev event
 * @api private
 */

ProposalOptions.prototype.vote = function(ev) {
  ev.preventDefault();

  var target = ev.target.parentNode
    , id = target.getAttribute('data-proposal')
    , value;

  if (classes(target).has('vote-no')) {
    value = 'negative';
  } else if (classes(target).has('vote-yes')) {
    value = 'positive';
  }

  request
  .post('/api/proposal/:id/vote'.replace(':id', id))
  .set('Accept', 'application/json')
  .send({value:value})
  .end(function (err, res) {
    if (err) {
      console.log(err);
      return;
    };

    if (res.body.error) {
      console.log(res.body.error);
      if (res.body.action && res.body.action.redirect) {
        return window.location.replace(res.body.action.redirect);
      };
    }
    // reload location.
    window.location.reload();
  });
}

/**
 * Render options
 *
 * @return {NodeElement} proposals options
 * @api public
 */

ProposalOptions.prototype.render = function() {
  this.renderChart();
  return this.options;
}

/**
 * Render chart into options block
 *
 * @return {ProposalOptions} `ProposalOptions` instance.
 * @api public
 */

ProposalOptions.prototype.renderChart = function(arguments) {
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