import view from '../../view/mixin';
import template from './template.jade';
import topicFilter from '../../topic-filter/topic-filter';

export default class Filter extends view('appendable', 'removeable', 'withEvents') {
  constructor (options) {
    options.template = template;
    super(options);
    this.switchOn();
  }

  switchOn () {
    this.bind('click', '[data-hide-voted]', this.onhidevotedclick);
  }

  onhidevotedclick (e) {
    topicFilter.setFilter({ hideVoted: e.target.checked });
  }
}
