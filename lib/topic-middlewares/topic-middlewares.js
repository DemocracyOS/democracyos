import debug from 'debug';
import topicStore from '../topic-store/topic-store';

const log = debug('democracyos:topic-middlewares');

export function findTopicsOfCurrentForum(ctx, next) {
  topicStore
    .findAll(ctx.params.forum)
    .then(topics => {
      ctx.topics = topics;
      next();
    })
    .catch(err => {
      if (404 !== err.status) throw err;
      const msg = 'Unable to load topics for forum ' + ctx.params.forum.name;
      return log(msg);
    });
}

/**
 * Load specific topic from context params
 */

export function findTopic(ctx, next) {
  topicStore
    .findOne(ctx.params.id)
    .then(topic => {
      ctx.topic = topic;
      next();
    })
    .catch(err => {
      if (404 !== err.status) throw err;
      const msg = 'Unable to load topic for ' + ctx.params.id;
      log(msg);
    });
}
