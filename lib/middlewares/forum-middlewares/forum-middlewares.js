import debug from 'debug'
import page from 'page'
import forumStore from '../../stores/forum-store/forum-store'

const log = debug('democracyos:forum-middlewares')

/**
 * Clear forum store, to force a fetch to server on next call
 */

export function clearForumStore (ctx, next) {
  forumStore.clear()
  next()
}

/**
 * Load from ':forum' param, and set ctx.forum.
 */

export function findForum (ctx, next) {
  if (!ctx.params.forum) return next()

  forumStore.findOneByName(ctx.params.forum)
    .then((forum) => {
      ctx.forum = forum
      log(`set ctx.forum to '${forum.name}'.`)
      next()
    })
    .catch((err) => {
      if (err.status === 401) return next()
      if (err.status === 404) return page.redirect('/404')
      log(err)
      page.redirect('/500')
    })
}

/**
 * Load all forums and set ctx.forums
 */

export function findAll (ctx, next) {
  forumStore.findAll()
    .then((forums) => {
      ctx.forums = forums
      next()
    })
    .catch((err) => {
      if (err.status === 404) return page.redirect('/404')
      page.redirect('/500')
    })
}

/**
 * Midleware Generator to verify Forum privileges
 */

export function privileges (privilege) {
  return function privilegesMiddleware (ctx, next) {
    if (ctx.forum && ctx.forum.privileges[privilege]) return next()
  }
}
