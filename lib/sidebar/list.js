import bus from 'bus';
import t from 't-component';
import debug from 'debug';
import { dom } from '../render/render.js';
import View from '../view/view.js';
import filter from '../laws-filter/laws-filter.js';
import listItem from './list-item.jade';
import template from './list-container.jade';
import check from './check.jade';

let log = debug('democracyos:sidebar:list');

class ListView extends View {
  constructor () {
    super(template);
  }

  switchOn () {
    bus.on('participants:updated', this.bound('onparticipants'));
    filter.on('reload', this.bound('refresh'));
  };

  switchOff () {
    bus.off('participants:updated', this.bound('onparticipants'));
    filter.off('reload', this.bound('refresh'));
  };

  refresh () {
    // Build list contents
    this.el.empty();
    filter.items().forEach(((item) => this.append(item)), this);
  };

  onparticipants (participants) {
    var participantsDiv = this.find('li.active a span.created-by div');
    var cardinality = 1 === participants.length ? 'singular' : 'plural';
    var html = participants.length + ' ' + t('proposal-article.participant.' + cardinality);
    participantsDiv.html(html);
  };

  vote (id) {
    var itemLink = itemEl.find('li[data-id=":id"] a'.replace(':id', id));
    itemLink.addClass('voted');
    var itemBadges = itemLink.find('.item-badges');
    itemBadges.append(dom(check));

    filter.vote(id);
  }

  append (item) {
    var itemEl = dom(listItem, { item: item });
    this.el.append(itemEl);
  }

  ready (fn) {
    filter.ready(fn);
    filter.ready(this.bound('refresh'));
  }
}

export default new ListView;
