import bus from 'bus';
import dom from 'component-dom';
import page from 'page';
import config from '../config/config';
import user from '../user/user';
import Newsfeed from './view';
import { findAll as findAllForums, clearForumStore } from '../forum-middlewares/forum-middlewares';

if (config.multiForum) {
  page('/', initHomepage, user.optional, clearForumStore, findAllForums, loadHomepage);
  page.exit('/', onExit);
}

function initHomepage(ctx, next) {
  document.body.classList.add('newsfeed');
  ctx.content = document.querySelector('#content');
  dom(ctx.content).empty();
  next();
}

function loadHomepage(ctx) {
  new Newsfeed({
    container: ctx.content,
    forums: ctx.forums
  });

  bus.emit('page:render');
}

function onExit(ctx, next) {
  document.body.classList.remove('newsfeed');
  next();
}