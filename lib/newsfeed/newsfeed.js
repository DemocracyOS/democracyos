import o from 'component-dom';
import page from 'page';
import user from '../user/user';
import Newsfeed from './view';

page('/newsfeed', user.optional, () => {
  let newsfeed = new Newsfeed();

  o(document.body).addClass('newsfeed');
  newsfeed.replace('#content');
});
