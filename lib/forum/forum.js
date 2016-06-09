import debug from 'debug'
import page from 'page'
import dom from 'component-dom'
import t from 't-component'
import bus from 'bus'
import config from '../config/config'
import { findForum } from '../forum-middlewares/forum-middlewares'
import forumRouter from '../forum-router/forum-router'
import title from '../title/title'
import user from '../user/user'
import ForumForm from '../forum-form/forum-form'
import { verifyForumAccess } from './not-allowed/not-allowed'

const log = debug('democracyos:forum')

page('/forums/new', user.required, onlyAllowOnFirstSetup, () => {
  log('render /forums/new')

  title(t('forum.new.title'))
  document.body.classList.add('forum-new')

  let section = dom('section#content.site-content').empty()
  let view = new ForumForm()

  view.appendTo(section[0])
})

page.exit('/forums/new', (ctx, next) => {
  document.body.classList.remove('forum-new')
  next()
})

if (config.multiForum) {
  page(forumRouter('/'), setDefaultForum, findForum, verifyForumAccess, emitForumChange)
  page.exit(forumRouter('/'), emitForumChange)
}

page(forumRouter('*'), setDefaultForum, findForum, verifyForumAccess, emitForumChange)
page.exit(forumRouter('*'), emitForumChange)

function onlyAllowOnFirstSetup (ctx, next) {
  if (config.multiForum) return next()
  if (!config.defaultForum && !user.staff) return page.redirect('/404')
  if (!config.defaultForum) return next()
  page.redirect('/')
}

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
