import debug from 'debug';
import page from 'page';
import topicStore from '../topic-store/topic-store';

const log = debug('democracyos:topic-middlewares');

export function topicsByForum(ctx, next) {
  const id = ctx.forum ? ctx.forum.id : null;

  topicStore
    .findAll(id)
    .then(topics => {
      ctx.topics = topics;
      next();
    })
    .catch(err => {
      const message = 'Unable to load topics for forum ' + ctx.params.forum.name;
      return log(message);
    })
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
      const message = 'Unable to load topic for ' + ctx.params.id;
      return log(message);
    })
}