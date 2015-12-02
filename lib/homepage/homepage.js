import bus from 'bus';
import debug from 'debug';
import page from 'page';
import dom from 'component-dom';
import { domRender } from '../render/render';
import user from '../user/user';
import urlBuilder from '../url-builder/url-builder';
import noTopics from './no-topics.jade';
import createFirstTopic from './create-first-topic.jade';
import visibility from '../visibility/visibility';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';
import { findTopics, clearTopicStore } from '../topic-middlewares/topic-middlewares';
import topicStore from '../topic-store/topic-store';
import topicFilter from '../topic-filter/topic-filter';
import title from '../title/title';
import { show as showTopic } from '../topic/topic';

const log = debug('democracyos:homepage');

function initHomepage(ctx, next) {
  document.body.classList.add('browser-page');
  dom('#browser .app-content, #content').empty();
  next();
}

page(forumRouter('/'),
  initHomepage,
  clearTopicStore,
  user.optional,
  visibility,
  findTopics,
  (ctx, next) => {
    let forum = ctx.forum;
    let topic = topicFilter.filter(ctx.topics)[0];

    if (!topic) {
      let content = dom('#browser .app-content');
      content.append(domRender(noTopics));

      if (user.isAdmin(forum)) content.append(domRender(createFirstTopic, {
        url: urlBuilder.admin(forum) + '/topics/create'
      }));

      bus.once('page:change', () => {
        document.body.classList.remove('browser-page');
      });

      bus.emit('page:render');
      return;
    }

    title(config.multiForum ? forum.title : null);

    log(`render topic ${topic.id}`);

    let path;
    if (config.multiForum) {
      path = `${forum.url}topic/${topic.id}`;
    } else {
      path = `/topic/${topic.id}`;
    }

    topicStore.findOne(topic.id).then(showTopic);
  }
);
