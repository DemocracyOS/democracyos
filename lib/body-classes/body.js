/**
 * Module dependencies.
 */

import page from 'page'
import bus from 'bus'
import o from 'component-dom'
import config from '../config/config.js'

page('*', (ctx, next) => {
  bus.emit('page:change', ctx.path)
  var body = o(document.body)
  body.removeClass(/[^browser\-page]/)
  body.addClass(config.env)
  next()
})
