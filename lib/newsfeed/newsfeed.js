/**
 * Module dependencies
 */

import bus from 'bus';
import o from 'dom';
import page from 'page';
import user from '../user/user';
import Newsfeed from './view.js'

page('/newsfeed', user.optional, (ctx, next) => {
  let newsfeed = new Newsfeed();

  o(document.body).addClass('newsfeed');
  newsfeed.replace('#content');
})