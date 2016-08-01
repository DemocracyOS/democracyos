import bus from 'bus'
import dom from 'component-dom'
import page from 'page'
import config from '../../config/config'
import {
  findAll as findAllForums,
  clearForumStore
} from '../../middlewares/forum-middlewares/forum-middlewares'
import Newsfeed from './view'

if (config.multiForum) {
  page('/', initHomepage, clearForumStore, findAllForums, loadHomepage)
  page.exit('/', onExit)
}

function initHomepage (ctx, next) {
  document.body.classList.add('newsfeed')
  ctx.content = document.querySelector('#content')
  dom(ctx.content).empty()
  next()
}

function loadHomepage (ctx) {
  ctx.view = new Newsfeed({
    container: ctx.content,
    forums: ctx.forums
  })

  bus.emit('page:render')
}

function onExit (ctx, next) {
  document.body.classList.remove('newsfeed')
  next()
}
