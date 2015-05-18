import page from 'page';
import o from 'component-dom';
import citizen from '../citizen/citizen.js';
import Forum from './view.js';
import title from '../title/title.js';
import t from 't-component';

page('/forums/new', citizen.required, (ctx, next) => {
  title(t('deployment.new.title'));
  o('body').addClass('deployment-new');

  var section = o('section.site-content').empty();
  var forum = new Forum();
  forum.appendTo(section[0]);
});
