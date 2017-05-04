import page from 'page'
import urlBuilder from 'lib/url-builder'
import whitelists from 'lib/whitelists/whitelists'
import { privileges } from 'lib/middlewares/forum-middlewares/forum-middlewares'
import View from './view'

page(urlBuilder.for('admin.users'),
  privileges('canEdit'),
  whitelists.middleware,
  (ctx) => {
    const view = new View(whitelists.get())
    view.replace('.admin-content')
    ctx.sidebar.set('users')
  }
)
