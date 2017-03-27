import page from 'page'

/**
 * Render 404 on backend
 */

page('*', (ctx) => {
  window.location = ctx.path
})
