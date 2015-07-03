import debug from 'debug';
import page from 'page';
import config from '../config/config';
import forumRouter from '../forum-router/forum-router';
import { getForum, restrictUserWithForum } from '../forum-middlewares/forum-middlewares';
import o from 'component-dom';
import title from '../title/title';
import t from 't-component';
import user from '../user/user';
import ForumForm from '../forum-form/forum-form';
import topics from '../topics/topics';
import topicsFilter from '../topics-filter/topics-filter';

const log = debug('democracyos:forum');

if (config.multiForum) {
  page(forumRouter('/'), user.optional, getForum, topics.middleware, topicsFilter.middleware, (ctx, next) => {
    let forum = ctx.forum;
    let topic = topicsFilter.items()[0];

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
