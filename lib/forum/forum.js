import page from 'page';
import o from 'component-dom';
import user from '../user/user';
import View from './view';
import title from '../title/title';
import t from 't-component';
import * as forum from '../forum-model/middlewares';

page('/forums/new', user.required, () => {
  title(t('forum.new.title'));
  o('body').addClass('forum-new');

  var section = o('section.site-content').empty();
  var view = new View();
  view.appendTo(section[0]);
});

page('/:forum', forum.loadForumFromParams, ctx => {
  console.log(ctx.params.forum);
  console.log(ctx.forum);
});
