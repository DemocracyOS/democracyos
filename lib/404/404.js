import o from 'component-dom'
import template from './template.jade'
import { dom } from '../render/render.js'
import page from 'page'
debugger
page('*', (ctx, next) => {
  debugger
  o(document.body).addClass('not-found-page')
  let view = dom(template)
  o('#content').empty().append(view)
})
