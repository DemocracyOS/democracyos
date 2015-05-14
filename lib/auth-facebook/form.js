import t from 't';
import config from '../config/config';
import title from '../title/title';
import View from '../view/view';
import template from './template.jade';

export default function form (ctx, next) {
  if (!config.facebookSignin) return next();

  // Build signin view with options
  var view = new View(template);

  // Display section content
  document.body.addClass('auth-facebook-form-page');

  // Update page's title
  title(t('signin.login'));

  // Render signin-page into content section
  view.replace('#content');
}