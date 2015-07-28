import bus from 'bus';
import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import { dom } from '../render/render';
import user from '../user/user';
import noTopics from './no-topics.jade';
import createFirstTopic from './create-first-topic.jade';
import visibility from '../visibility/visibility';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';
import { findForum } from '../forum-middlewares/forum-middlewares';
import { findTopics } from '../topic-middlewares/topic-middlewares';
import topicFilter from '../topic-filter/topic-filter';
import title from '../title/title';

const log = debug('democracyos:homepage');

page(forumRouter('/'), user.optional, visibility, findForum, findTopics, (ctx, next) => {
  const body = o(document.body);

  let forum = ctx.forum;
  let topic = topicFilter.get(0);

  body.addClass('browser-page');

  if (!topic) {
    let content = o('#browser .app-content');
    content.empty().append(dom(noTopics));
    if (user.staff) content.append(dom(createFirstTopic));
    bus.once('page:change', () => body.removeClass('browser-page'));
    bus.emit('page:render');
    return;
  }

  title(config.multiForum ? forum.title : null);

  log(`render topic ${topic.id}`);

  if (config.multiForum) {
    ctx.path = `${forum.url}/topic/${topic.id}`;
  } else {
    ctx.path = `/topic/${topic.id}`;
  }

  next();
});
