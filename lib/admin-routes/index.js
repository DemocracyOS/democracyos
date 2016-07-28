import page from 'page'
import forumRouter from '../forum-router/forum-router'

/**
 * Reload settings page
 */

page(forumRouter('/admin/'), reload)
page(forumRouter('/admin/*'), reload)

function reload () {
  window.location.reload(false)
}
