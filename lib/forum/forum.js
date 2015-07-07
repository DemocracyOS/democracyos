import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import t from 't-component';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';
import topicStore from '../topic-store/topic-store';
import { findForum, restrictUserWithForum } from '../forum-middlewares/forum-middlewares';
import { findPublicTopics } from '../topic-middlewares/topic-middlewares';
import title from '../title/title';
import user from '../user/user';
import ForumForm from '../forum-form/forum-form';

const log = debug('democracyos:forum');

if (config.multiForum) {
  page(forumRouter('/'), user.optional, findForum, findPublicTopics, (ctx, next) => {
    let forum = ctx.forum;
    topicStore.sort(ctx.topics);
    let topic = ctx.topics[0];

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
