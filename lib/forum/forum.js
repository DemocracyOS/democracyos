import page from 'page';
import o from 'component-dom';
import user from '../user/user';
import Forum from './view';
import title from '../title/title';
import t from 't-component';
import forum from '../forum-model/forum'

page('/forums/new', user.required, (ctx, next) => {
  title(t('forum.new.title'));
  o('body').addClass('forum-new');

  var section = o('section.site-content').empty();
  var forum = new Forum();
  forum.appendTo(section[0]);
});

page('/:forum', forum.required, (ctx, next) => {
  console.log(ctx.params.forum);
});
