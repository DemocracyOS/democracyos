import bus from 'bus'
import dom from 'component-dom'
import page from 'page'
import config from '../config/config'
import user from '../user/user'
import Newsfeed from './view'
import { findAll as findAllForums, clearForumStore } from '../forum-middlewares/forum-middlewares'

if (config.multiForum) {
  page('/', initHomepage, user.optional, clearForumStore, findAllForums, loadHomepage)
}

function initHomepage (ctx, next) {
  document.body.classList.add('newsfeed')
  ctx.content = document.querySelector('#content')
  dom(ctx.content).empty()
  bus.once('page:change', () => document.body.classList.remove('newsfeed'))
  next()
}

function loadHomepage (ctx) {
  ctx.view = new Newsfeed({
    container: ctx.content,
    forums: ctx.forums
  })

  bus.emit('page:render')
}
