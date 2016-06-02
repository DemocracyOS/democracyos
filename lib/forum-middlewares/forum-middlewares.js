import debug from 'debug'
import page from 'page'
import forumStore from '../forum-store/forum-store'

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
    .then(forum => {
      ctx.forum = forum
      log(`set ctx.forum to '${forum.name}'.`)
      next()
    })
    .catch(err => {
      if (err) return page('/')
      throw err
    })
}

/**
 * Load of logged in user, and set ctx.userForum.
 */

export function findUserForum (ctx, next) {
  forumStore.findUserForum()
    .then(userForum => {
      ctx.userForum = userForum
      log(`set ctx.userForum to '${userForum.name}'.`)
      next()
    })
    .catch(err => {
      if (err.status === 404) return next()
      throw err
    })
}

/**
 * Dont let in users that already have a forum.
 */

export function restrictUserWithForum (ctx, next) {
  forumStore.findUserForum()
    .then(() => page('/'))
    .catch(err => {
      if (err.status === 404) return next()
      throw err
    })
}

/**
 * Load all forums and set ctx.forums
 */

export function findAll (ctx, next) {
  forumStore.findAll()
    .then(forums => {
      ctx.forums = forums
      next()
    })
}
