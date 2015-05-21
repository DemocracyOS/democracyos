/**
 * Module dependencies
 */

import bus from 'bus';
import o from 'dom';
import page from 'page';
import feeds from '../feeds';
import Newsfeed from './view.js'

page('/newsfeed', feeds.middleware, (ctx, next) => {
  let newsfeed = new Newsfeed(feeds.items);

  newsfeed.fill();
  o(document.body).addClass('newsfeed');
  newsfeed.replace('#content');
})