import dom from 'component-dom';
import page from 'page';
import config from '../config/config';
import user from '../user/user';
import Newsfeed from './view';
import { findAll as findAllForums } from '../forum-middlewares/forum-middlewares';

if (config.multiForum) {
  page('/', user.optional, findAllForums, ctx => {
    document.body.classList.add('newsfeed');

    const content = document.querySelector('#content');
    dom(content).empty();

    const newsfeed = new Newsfeed({
      container: content,
      forums: ctx.forums
    });
  });
}
