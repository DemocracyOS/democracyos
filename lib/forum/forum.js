import page from 'page'

import bus from 'bus'
import config from '../config/config'
import { findForum } from '../middlewares/forum-middlewares/forum-middlewares'
import forumRouter from '../forum-router/forum-router'
import { verifyForumAccess } from './not-allowed/not-allowed'

if (config.multiForum) {
  page(forumRouter('/'), setDefaultForum, findForum, verifyForumAccess, emitForumChange)
  page.exit(forumRouter('/'), emitForumChange)
}

page(forumRouter('*'), setDefaultForum, findForum, verifyForumAccess, emitForumChange)
page.exit(forumRouter('*'), emitForumChange)

function setDefaultForum (ctx, next) {
  if (config.multiForum) return next()

  if (config.defaultForum) {
    ctx.params.forum = config.defaultForum
    return next()
  }

  page.redirect('/forums/new')
}

function emitForumChange (ctx, next) {
  bus.emit('forum:change', ctx.forum)
  next()
}
