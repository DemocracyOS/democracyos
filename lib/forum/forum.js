import page from 'page'
import bus from 'bus'
import config from '../config/config'
import { serial } from '../middlewares/utils/utils'
import { findForum } from '../middlewares/forum-middlewares/forum-middlewares'
import { verifyForumAccess } from './not-allowed/not-allowed'

export const loadCurrentForum = serial(
  setDefaultForum,
  findForum,
  verifyForumAccess,
  emitForumChange
)

page.exit('*', emitForumChange)

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
