import page from 'page';
import whitelists from '../whitelists/whitelists';
import forumRouter from '../forum-router/forum-router';
import { privileges } from '../forum-middlewares/forum-middlewares';
import View from './view';

page(forumRouter('/admin/users'), privileges('canEdit'), whitelists.middleware, function (ctx) {
  var view = new View(whitelists.get());
  view.replace('.admin-content');
  ctx.sidebar.set('users');
});
