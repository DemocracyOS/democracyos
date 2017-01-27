import debug from 'debug'
import tagStore from '../../stores/tag-store/tag-store'

const log = debug('democracyos:tag-middlewares')

/**
 * Clear tag store, to force a fetch to server on next call
 */

export function clearTagStore (ctx, next) {
  tagStore.clear()
  next()
}

export function findAllTags (ctx, next) {
  tagStore
    .findAll()
    .then((tags) => {
      ctx.tags = tags
      next()
    })
    .catch((err) => {
      if (err.status !== 404) throw err
      const message = 'Unable to load tags'
      return log(message, err)
    })
}

/**
 * Load specific tag from context params
 */

export function findTag (ctx, next) {
  tagStore
    .findOne(ctx.params.id)
    .then((tag) => {
      ctx.tag = tag
      return next()
    })
    .catch((err) => {
      if (err.status !== 404) throw err
      const message = 'Unable to load tag for ' + ctx.params.id
      return log(message, err)
    })
}
