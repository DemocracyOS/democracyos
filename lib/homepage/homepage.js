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
  o(document.body).addClass('browser-page');

  let law = sidebar.items(0);

  let pageChanged = false;
  function onpagechange() {
    pageChanged = true;
    o(document.body).removeClass('browser-page');
  }

  if (!law) {
    var content = o('#browser .app-content');
    var el = dom(noLaws);
    content.empty().append(el);
    citizen.ready(function(){
      if (pageChanged) return;
      if (citizen.staff) {
        var el = dom(createFirstLaw);
        content.append(el);
      }
    });
    bus.once('page:change', onpagechange);
    return bus.emit('page:render');
  }

  log('render law %s', law.id);
  ctx.path = '/law/' + law.id;
  next();
});
