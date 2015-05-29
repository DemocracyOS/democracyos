import bus from 'bus';
import debug from 'debug';
import page from 'page';
import o from 'component-dom';
import sidebar from '../sidebar/main.js';
import { dom } from '../render/render.js';
import citizen from '../citizen/citizen.js';
import noTopics from './no-topics.jade';
import createFirstTopic from './create-first-topic.jade';
import visibility from '../visibility/visibility.js';
import config from '../config/config.js';
import Router from '../router';

// Routing.
let log = debug('democracyos:homepage');
let router = Router(config);

page('/', citizen.optional, visibility, (ctx, next) => sidebar.ready(next), (ctx, next) => {
  let body = o(document.body);
  let topic = sidebar.items(0);
  let pageChanged = false;

  body.addClass('browser-page');

  if (!topic) {
    let content = o('#browser .app-content');
    content.empty().append(dom(noTopics));
    citizen.ready(() => {
      if (!pageChanged && citizen.staff) {
        content.append(dom(createFirsttopic));
      }
    });
    bus.once('page:change', () => pageChanged = true && body.removeClass('browser-page'));
    return bus.emit('page:render');
  }

  log(`render topic ${topic.id}`);
  ctx.path = router(`/topic/${topic.id}`);
  next();
});
