import page from 'page'
import whitelists from '../../whitelists/whitelists'
import urlBuilder from 'lib/url-builder'
import { privileges } from '../../middlewares/forum-middlewares/forum-middlewares'
import View from './view'

page(urlBuilder.for('admin.users'), privileges('canEdit'), whitelists.middleware, function (ctx) {
  var view = new View(whitelists.get())
  view.replace('.admin-content')
  ctx.sidebar.set('users')
})
