import debug from 'debug';
import page from 'page';
import config from '../config/config.js';
import forumRouter from '../forum-router/forum-router';
import forumStore from '../forum-store/forum-store';
import o from 'component-dom';
import title from '../title/title';
import t from 't-component';
import user from '../user/user';
import ForumNew from '../forum-new/forum-new';

const log = debug('democracyos:forum');

/**
 * Middleware to load forum from current page url, gets it from '/:forum'.
 *
 * @return {Middleware}
 * @api public
 */

if (!config.singleForum) page(forumRouter(), (ctx, next) => {
  forumStore.get(ctx.params.forum)
    .then(forum => {
      ctx.forum = forum;
      log('Setted `ctx.forum`.');
      next();
    })
    .catch(err => log('Found error %s', err));
});

if (!config.singleForum) page(forumRouter(), () => {
  console.log('Forum homepage');
});

page('/forums/new', user.required, () => {
  title(t('forum.new.title'));
  o('body').addClass('forum-new');

  let section = o('section.site-content').empty();
  let view = new ForumNew();
  view.appendTo(section[0]);
});
