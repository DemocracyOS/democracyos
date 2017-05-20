import debug from 'debug'
import page from 'page'
import dom from 'component-dom'
import t from 't-component'
import urlBuilder from 'lib/url-builder'

import title from '../../title/title'
import user from '../../user/user'
import ForumForm from './forum-form/forum-form'

const log = debug('democracyos:forum')

page(urlBuilder.for('forums.new'), user.required, canCreateForum, () => {
  log('render forums.new')

  title(t('forum.new.title'))
  document.body.classList.add('forum-new')

  let section = dom('section#content.site-content').empty()
  let view = new ForumForm()

  view.appendTo(section[0])
})

page.exit(urlBuilder.for('forums.new'), (ctx, next) => {
  document.body.classList.remove('forum-new')
  next()
})

function canCreateForum (ctx, next) {
  if (user.privileges.canCreate) return next()
  log('Forums can be created by a staff members only.')
  return page.redirect('/404')
}
