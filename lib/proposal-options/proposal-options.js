import o from 'component-dom';
import closest from 'component-closest';
import Chart from 'chart.js';
import t from 't-component';
import debug from 'debug';
import user from '../user/user';
import topicStore from '../topic-store/topic-store';
import request from '../request/request';
import View from '../view/view';
import { dom } from '../render/render';
import template from './template.jade';
import positive from './vote-positive.jade';
import negative from './vote-negative.jade';
import neutral from './vote-neutral.jade';

let log = debug('democracyos:proposal-options');

export default class ProposalOptions extends View {

  /**
   * Proposal Options view
   *
   * @param {Array} proposals list of proposals
   * @param {Object} selected proposal object
   * @return {ProposalOptions} `ProposalOptions` instance.
   * @api public
   */

  constructor (options = {}) {
    let proposal = options.proposal;

    super(template, {
      proposal: options.proposal,
      reference: proposal.url,
      canVote: options.canVote || false
    });

    this.proposal = proposal;

    this.bind('click', '.vote-box .direct-vote .vote-option', 'vote');
    this.bind('click', '.vote-box .meta-data .change-vote', 'changevote');

    this.on('vote', this.onvote.bind(this));
    this.on('voting', this.onvoting.bind(this));
    this.on('voteerror', this.onvoteerror.bind(this));

    this.buttonsBox = this.find('.vote-box .vote-options');
  }

  switchOn() {
    this.renderChart();
  }

  /**
   * Vote for option
   *
   * @param {Object} ev event
   * @api private
   */

  vote (ev) {
    let value;
    let id = this.proposal.id;

    ev.preventDefault();

    let target = ev.delegateTarget || closest(ev.target, '[data-proposal]');
    if (o(target).hasClass('vote-no')) {
      value = 'negative';
    } else if (o(target).hasClass('vote-yes')) {
      value = 'positive';
    } else if (o(target).hasClass('vote-abstain')) {
      value = 'neutral';
    }

    if (user.id) {
      log('casting vote %s for %s', value, id);
      this.emit('voting', value);

      topicStore.vote(id, value).then(() => {
        this.emit('vote', value);
      }).catch(err => {
        this.emit('voteerror', value);
        log('Failed cast %s for %s with error: %j', value, id, err);
      });
    } else {
      this.find('.proposal-options p.text-mute').removeClass('hide');
    }
  }

  onvoting (value) {
    this.find('#voting-error').addClass('hide');
    this.find('.vote-options').addClass('hide');
    this.find('a.meta-item').addClass('hide');

    let el;

    this.unvote();

    switch (value) {
      case 'negative':
        this.proposal.downvotes.push(user.id);
        el = dom(negative);
        break;
      case 'positive':
        this.proposal.upvotes.push(user.id);
        el = dom(positive);
        break;
      case 'neutral':
        this.proposal.abstentions.push(user.id);
        el = dom(neutral);
        break;
    }

    var meta = this.find('.meta-data');

    meta.find('.alert').remove();

    //TODO: clear this of array handling when `dom` supports `insertBefore`
    meta[0].insertBefore(el, meta[0].firstChild);
  }

  onvoteerror (value) {
    this.find('.change-vote').addClass('hide');
    this.find('.vote-options').removeClass('hide');
    this.find('#voting-error').removeClass('hide');

    this.find('.meta-data').find('.alert').remove();
  }

  onvote (value) {
    this.find('.change-vote').removeClass('hide');

    var cast = this.find('.votes-cast em');

    var upvotes = this.proposal.upvotes || [];
    var downvotes = this.proposal.downvotes || [];
    var abstentions = this.proposal.abstentions || [];
    var census = abstentions.concat(downvotes).concat(upvotes) || [];

    cast.html(t(t('proposal-options.votes-cast', { num: census.length || "0" })));
    this.track('vote topic');
  }

  track (event) {
    analytics.track(event, {
      topic: this.proposal.id
    });
  }

  unvote () {
    if (~this.proposal.upvotes.indexOf(user.id)) {
      this.proposal.upvotes.splice(user.id, 1);
    }
    if (~this.proposal.downvotes.indexOf(user.id)) {
      this.proposal.downvotes.splice(user.id, 1);
    }
    if (~this.proposal.abstentions.indexOf(user.id)) {
      this.proposal.abstentions.splice(user.id, 1);
    }
  }

  /**
   * Change vote
   *
   * @param {Object} ev event
   * @api private
   */

  changevote (ev) {
    ev.preventDefault();

    this.buttonsBox.toggleClass('hide');
  }

  post (path, payload, fn) {
    request
    .post(path)
    .send(payload)
    .end(fn);
  }

  /**
   * Render chart into options block
   *
   * @return {ProposalOptions} `ProposalOptions` instance.
   * @api public
   * @deprecated
   */

  renderChart () {
    let container = this.find('#results-chart');
    let upvotes = this.proposal.upvotes || [];
    let downvotes = this.proposal.downvotes || [];
    let abstentions = this.proposal.abstentions || [];
    let census = abstentions.concat(downvotes).concat(upvotes);
    let data = [];

    if (!container.length) return;

    if (census.length) {
      data.push({
        value: upvotes.length,
        color: "#a4cb53",
        label: t('proposal-options.yea'),
        labelColor: "white",
        labelAlign: "center"
      });
      data.push({
        value: abstentions.length,
        color: "#666666",
        label: t('proposal-options.abstain'),
        labelColor: "white",
        labelAlign: "center"
      });
      data.push({
        value: downvotes.length,
        color: "#d95e59",
        label: t('proposal-options.nay'),
        labelColor: "white",
        labelAlign: "center"
      });

      new Chart(container[0].getContext('2d')).Pie(data, { animation: false });
    }
  }
}
