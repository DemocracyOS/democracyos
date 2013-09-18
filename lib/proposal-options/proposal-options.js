/**
 * Module dependencies.
 */

var page = require('page')
  , domify = require('domify')
  , delegates = require('delegates')
  , classes = require('classes')
  , request = require('superagent')
  , options = require('./options')
  , closest = require('closest')
  , Chart = require('Chart.js')
  , log = require('debug')('proposal-options');

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
  this.events.bind('click .vote-box .direct-vote .vote-option span', 'vote');
  this.events.bind('click .vote-box .proxy-vote .vote-option span', 'proxy');
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

  var target = closest(ev.target, '.vote-option') 
    , id = target.getAttribute('data-proposal')
    , value;

  if (classes(target).has('vote-no')) {
    value = 'negative';
  } else if (classes(target).has('vote-yes')) {
    value = 'positive';
  } else if (classes(target).has('vote-abstain')) {
    value = 'neutral';
  }

  this.post(
    '/api/proposal/:id/vote'.replace(':id', id),
    {value:value},
    function(res) { page(window.location.pathname) }
  );
}

ProposalOptions.prototype.proxy = function(ev) {
  ev.preventDefault();

  //Show an input that finds possible trustees
}

ProposalOptions.prototype.delegate = function(ev) {
  ev.preventDefault();

  //get stuff from event
  
  this.post(
    '/api/delegation/create',
    { tag: 'tag', tid: 'trusteeId' },
    function(res) { page(windows.location.pathname) }
  );  
}

ProposalOptions.prototype.post = function(path, payload, onSucces, onBodyError, onError) {
  request
  .post(path)
  .set('Accept', 'application/json')
  .send(payload)
  .end(function (err, res) {
    if (err) {
      log(err);
      if (onError) {
        return onError(err);
      }
      else return;
    };

    if (res.body.error) {
      log(res.body.error);
      if (onBodyError) {
        return onBodyError();
      } else if (res.body.action && res.body.action.redirect) {
        return window.location.replace(res.body.action.redirect);
      };
    }
    
    if (onSucces) {
      return onSucces(res);
    } 
    else return;
  });
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