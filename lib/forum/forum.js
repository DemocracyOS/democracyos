import page from 'page';
import o from 'component-dom';
import user from '../user/user.js';
import Forum from './view.js';
import title from '../title/title.js';
import t from 't-component';

page('/forums/new', user.required, (ctx, next) => {
  title(t('forum.new.title'));
  o('body').addClass('forum-new');

  var section = o('section.site-content').empty();
  var forum = new Forum();
  forum.appendTo(section[0]);
});
