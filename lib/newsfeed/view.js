/**
 * Module dependencies
 */

import Card from './card';
import feeds from '../feeds';
import View from '../view/view';
import loading from 'loading-lock';
import template from './template.jade'

export default class Newsfeed extends View {
  constructor() {
    super(template);
    this.page = 0;
    this.loading = this.find('.loading-container');
    this.fill();
  }

  switchOn() {
    this.bind('click', '.load-more', this.bound('more'));
  }

  fill() {
    this.loading.removeClass('hide');
    var locker = loading(this.loading[0], {});
    locker.lock();

    feeds.fetch(null, this.page);

    feeds.once('fetch', (feeds) => {
      locker.unlock();
      this.page++;

      var last = feeds.length && feeds[feeds.length - 1].id;

      if (this.lastFeed === last) {
        feeds = [];
      }

      this.insert(feeds, last);
    });
  }

  insert(feeds, last) {
    feeds.forEach((feed) => {
      this.loading.addClass('hide');
      var card = new Card(feed);
      card.appendTo('.feeds');
    });

    if (feeds.length) {
      this.lastFeed = last;
      this.find('.load-more').removeClass('hide');
    } else {
      this.find('.load-more').addClass('hide');
      this.find('.loading-container').remove();
      this.find('.nothing').removeClass('hide');
    }
  }

  more() {
    this.fill();
  }
}