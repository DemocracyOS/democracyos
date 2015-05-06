import o from 'component-dom';
import template from './template.jade';
import { dom } from '../render/render.js';
import page from 'page';

page('*', (ctx, next) => {
  o(document.body).addClass('not-found-page');
  let view = render.dom(template);
  o('#content').empty().append(view);
});
