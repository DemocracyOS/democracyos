import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import t from 't-component';
import config from '../config/config';
import { findForum,
         restrictUserWithForum } from '../forum-middlewares/forum-middlewares';
import forumRouter from '../forum-router/forum-router';
import title from '../title/title';
import user from '../user/user';
import ForumForm from '../forum-form/forum-form';

const log = debug('democracyos:forum');

page(forumRouter('/'), findForum);
page(forumRouter('/*'), findForum);

if (config.multiForum) {
  page('/forums/new', user.required, restrictUserWithForum, () => {
    log('render /forums/new');

    title(t('forum.new.title'));
    o('body').addClass('forum-new');

    let section = o('section#content.site-content').empty();
    let view = new ForumForm();
    view.appendTo(section[0]);
  });
}
