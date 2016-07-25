import page from 'page'

/**
 * Reload settings page
 */

page('/settings', reload)
page('/settings/', reload)
page('/settings/*', reload)

function reload () {
  window.location.reload(false)
}
