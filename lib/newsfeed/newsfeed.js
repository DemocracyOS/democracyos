/**
 * Module dependencies
 */

import bus from 'bus';
import o from 'dom';
import page from 'page';
import Newsfeed from './view.js'

page('/newsfeed', (ctx, next) => {
  let newsfeed = new Newsfeed();

  o(document.body).addClass('newsfeed');
  newsfeed.replace('.site-content');
})