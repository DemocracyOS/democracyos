import view from '../../view/mixin';
import template from './template.jade';
import topicFilter from '../../topic-filter/topic-filter';

export default class Filter extends view('appendable', 'removeable', 'withEvents') {
  constructor (options) {
    options.template = template;
    super(options);

    this.filter = this.options.locals;
    this.onHideVotedClick = this.onHideVotedClick.bind(this)
    this.onStatusClick = this.onStatusClick.bind(this)

    this.switchOn();
  }

  switchOn () {
    this.bind('click', '[data-hide-voted]', this.onHideVotedClick);
    this.bind('click', '[data-status]', this.onStatusClick);
  }

  onHideVotedClick (e) {
    topicFilter.setFilter({ hideVoted: e.target.checked });
  }

  onStatusClick (e) {
    let el = e.target;
    let status = el.getAttribute('data-status');

    if (this.filter.status === status) return;

    topicFilter.setFilter({ status: status });
  }
}
