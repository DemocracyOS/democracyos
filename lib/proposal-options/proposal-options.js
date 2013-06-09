/**
 * Module dependencies.
 */

var domify = require('domify')
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
  this.options = domify(options({ proposal: proposal, citizen: citizen }))[0];
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