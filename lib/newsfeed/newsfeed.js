import o from 'component-dom';
import page from 'page';
import config from '../config/config';
import user from '../user/user';
import Newsfeed from './view';
import { findAll as findAllForums } from '../forum-middlewares/forum-middlewares'

if (config.multiForum) {
  page('/', user.optional, findAllForums, (ctx, next) => {
    let newsfeed = new Newsfeed(ctx.forums);

    o(document.body).addClass('newsfeed');
    newsfeed.replace('#content');
  });
}
