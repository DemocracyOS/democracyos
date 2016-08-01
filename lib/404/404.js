import page from 'page'

/**
 * Render 404 on backend
 */

page('*', () => {
  window.location.reload(false)
})
