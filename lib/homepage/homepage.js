import bus from 'bus';
import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import sidebar from '../sidebar/main';
import { dom } from '../render/render';
import user from '../user/user';
import noTopics from './no-topics.jade';
import createFirstTopic from './create-first-topic.jade';
import visibility from '../visibility/visibility';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';

const log = debug('democracyos:homepage');

page('/', multiDemocracy);
page('/', user.optional, visibility, sidebarready, singleForum);

function sidebarready(ctx, next) {
  sidebar.ready(next);
}

function multiDemocracy(ctx, next) {
  if (config.singleForum) return next();

  ctx.path = '/newsfeed';

  next();
}

function singleForum(ctx, next) {
  let body = o(document.body);
  let topic = sidebar.items(0);
  let pageChanged = false;

  body.addClass('browser-page');

  if (!topic) {
    let content = o('#browser .app-content');
    content.empty().append(dom(noTopics));
    user.ready(() => {
      if (!pageChanged && user.staff) {
        content.append(dom(createFirstTopic));
      }
    });
    bus.once('page:change', () => {
      pageChanged = true;
      body.removeClass('browser-page');
    });
    return bus.emit('page:render');
  }

  log(`render topic ${topic.id}`);
  ctx.path = forumRouter(`/topic/${topic.id}`);
  next();
}
