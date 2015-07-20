import bus from 'bus';
import debug from 'debug';
import render from '../render/render.js';
import View from '../view/view.js';
import template from './sidebar-container.jade';
import filter from './filter.js';
import List from './list.js';
import topicsFilter from '../topics-filter/topics-filter.js';

let log = debug('democracyos:sidebar:view');

let get = (list, query) => {
  var match;
  var test = new Function('_', 'return _.' + query);

  list.some(l => {
    if (test(l)) {
      match = l;
      return true;
    }
    return false;
  });
  return match || null;
};

export default class SidebarView extends View {
  constructor (forum = null) {
    super(template);
    this.list = new List(forum);
    this.filtercontainer = this.find('#filter-container');
    this.listcontainer = this.find('#list-container');
    this.vote = this.vote.bind(this);
  }

  switchOn () {
    filter.ready(this.bound('onfilterready'));
    bus.on('vote', this.vote);
  }

  switchOff () {
    bus.off('vote', this.vote);
  }

  onfilterready () {
    filter.appendTo(this.filtercontainer[0]);
    this.list.ready(this.onlistready.bind(this));
  }

  onlistready () {
    this.list.appendTo(this.listcontainer[0]);
    this.state('loaded');
  }

  vote (id) {
    this.list.vote(id);
  }

  items (index) {
    return topicsFilter.items()[index];
  }

  select (id) {
    let els = this.find('ul.nav.navlist li');
    let el = this.find('ul.nav.navlist li[data-id="' + id + '"]');

    els.removeClass('active');
    el.addClass('active');

    return this;
  }

  selected () {
    if (!this.items()) return null;

    let el = this.el.querySelector('ul.nav.navlist li.active');
    let id = el ? el.getAttribute('data-id') : null;

    return id ? get(this.items(), 'id === %id'.replace('%id', id)) : null;
  }

  forum(forum) {
    this.list.setForum(forum);
  }

  /**
   * Handle errors
   *
   * @param {String} error
   * @return {SidebarView} Instance of `SidebarView`
   * @api public
   */

  error (message) {
    // TODO: We should use `Error`s instead of
    // `Strings` to handle errors...
    // Ref: http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
    this.state('error', message);
    log('error found: %s', message);

    // Unregister all `ready` listeners
    this.off('ready');
    return this;
  }
}
