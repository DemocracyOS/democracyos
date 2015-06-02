/**
 * Module dependencies
 */

import bus from 'bus';
import o from 'dom';
import page from 'page';
import citizen from '../citizen/citizen';
import Newsfeed from './view.js'

page('/newsfeed', citizen.optional, (ctx, next) => {
  let newsfeed = new Newsfeed();

  o(document.body).addClass('newsfeed');
  newsfeed.replace('#content');
})