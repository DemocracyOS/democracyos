import debug from 'debug';
import config from '../config/config';
import topicStore from '../topic-store/topic-store';
import topicFilter from '../topic-filter/topic-filter';

const log = debug('democracyos:topic-filter:middlewares');

/**
 * Load public topics from specified Forum
 */
export function findAll(ctx, next) {
  if (config.multiForum && !ctx.forum) {
    throw new Error('First you must fetch the current forum.');
  }

  let query = {};
  if (config.multiForum) query.forum = ctx.forum.id;

  topicStore.findAll(query).then(topics => {
    ctx.topics = topicFilter.set(topics);
    next();
  }).catch(err => {
    if (404 !== err.status) throw err;
    log(`Unable to load topics for forum ${ctx.forum.name}`);
  });
}
