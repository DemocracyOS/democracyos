import debug from 'debug';
import page from 'page';
import forumStore from '../forum-store/forum-store';

const log = debug('democracyos:forum');

page('/:forum', forumStore.getFromParamsMiddleware, () => {
  log('Setted `ctx.forum` variable.');
});
