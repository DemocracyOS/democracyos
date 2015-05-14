import page from 'page';
import o from 'component-dom';
import citizen from '../citizen/citizen.js';
import DemocracyForm from './view.js';
import title from '../title/title.js';
import t from 't-component';

page('/democracies/new', citizen.required, (ctx, next) => {
  title(t('deployment.new.title'));
  o('body').addClass('deployment-new');

  var section = o('section.site-content').empty();
  var deployment = new DemocracyForm();
  deployment.appendTo(section[0]);
});
