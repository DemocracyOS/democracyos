import debug from 'debug';
import page from 'page';
import tagStore from '../tag-store/tag-store';

const log = debug('democracyos:tag-middlewares');

export function findAllTags(ctx, next) {
  tagStore
    .findAll()
    .then(tags => {
      ctx.tags = tags;
      next();
    })
    .catch(err => {
      const message = 'Unable to load tags for forum ' + ctx.params.forum.name;
      return log(message);
    })
}

/**
 * Load specific tag from context params
 */

export function findTag(ctx, next) {
  tagStore
    .findOne(ctx.params.id)
    .then(tag => {
      ctx.tag = tag;
      return next();
    })
    .catch(err => {
      const message = 'Unable to load tag for ' + ctx.params.id;
      return log(message);
    });
}