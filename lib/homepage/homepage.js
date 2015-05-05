import bus from 'bus';
import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import sidebar from '../sidebar/main.js';
import { dom } from '../render/render.js';
import citizen from '../citizen/citizen.js';
import noLaws from './no-laws.jade';
import createFirstLaw from './create-first-law.jade';

let log = debug('democracyos:homepage');

page('/', (ctx, next) => sidebar.ready(next), (ctx, next) => {
  let body = o(document.body);
  let law = sidebar.items(0);
  let pageChanged = false;

  body.addClass('browser-page');

  if (!law) {
    let content = o('#browser .app-content');
    content.empty().append(dom(noLaws));
    citizen.ready(() => {
      if (!pageChanged && citizen.staff) {
        content.append(dom(createFirstLaw));
      }
    });
    bus.once('page:change', () => pageChanged = true && body.removeClass('browser-page'));
    return bus.emit('page:render');
  }

  log(`render law ${law.id}`);
  ctx.path = `/law/${law.id}`;
  next();
});
