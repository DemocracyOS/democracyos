import o from 'component-dom';
import page from 'page';
import config from '../config/config';
import user from '../user/user';
import Newsfeed from './view';

if (config.multiForum) {
  page('/newsfeed', user.optional, () => {
    let newsfeed = new Newsfeed();

    o(document.body).addClass('newsfeed');
    newsfeed.replace('#content');
  });
}
