/**
 * Module dependencies
 */

import Card from './card';
import feeds from '../feeds';
import View from '../view/view';
import loading from 'loading-lock';
import template from './template.jade';
import request from '../request/request';
import { dom } from '../render/render';
import buttonTemplate from './forum-button.jade';
import debug from 'debug';

let log = debug('democracyos:newsfeed');

export default class Newsfeed extends View {
  constructor() {
    super(template);
    this.page = 0;
    this.loading = this.find('.loading-container');
    this.start = this.find('.newsfeed.start');
    this.fill();
    this.createButton();
  }

  switchOn() {
    this.bind('click', '.load-more', this.bound('fill'));
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

  createButton() {
    request
      .get('/api/forum/mine')
      .end((err, res) => {
        if (err && err.status !== 404) return log('Error fetching users\' forum');

        const forum = res.body;
        let button = dom(buttonTemplate, { forum: forum });
        this.start.append(button);
      });
  }
}