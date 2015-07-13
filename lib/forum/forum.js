import debug from 'debug';
import bus from 'bus';
import page from 'page';
import o from 'component-dom';
import { dom } from '../render/render';
import t from 't-component';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';
import { findForum, restrictUserWithForum } from '../forum-middlewares/forum-middlewares';
import { findPublicTopicsSorted } from '../topic-middlewares/topic-middlewares';
import title from '../title/title';
import user from '../user/user';
import ForumForm from '../forum-form/forum-form';
import noTopics from '../homepage/no-topics.jade';

const log = debug('democracyos:forum');

if (config.multiForum) {
  page(forumRouter('/'), user.optional, findForum, findPublicTopicsSorted, (ctx, next) => {
    let body = o(document.body);

    let forum = ctx.forum;
    let topic = ctx.topics[0];

    body.addClass('browser-page');

    if (!topic) {
      let content = o('#browser .app-content');
      content.empty().append(dom(noTopics));
      bus.once('page:change', () => body.removeClass('browser-page'));
      bus.emit('page:render');
      return;
    }

    title(forum.title);
    o('body').addClass('browser-page');

    ctx.path = `${forum.url}/topic/${topic.id}`;

    log(`rendering landing of '${forum.name}'.`);

    next();
  });

  page('/forums/new', user.required, restrictUserWithForum, () => {
    title(t('forum.new.title'));
    o('body').addClass('forum-new');

    let section = o('section.site-content').empty();
    let view = new ForumForm();
    view.appendTo(section[0]);
  });
}
