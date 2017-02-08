import page from 'page'
import './analytics'

/**
 * Track every page change
 */

page('*', (ctx, next) => {
  window.analytics.page(ctx.path)
  next()
})
