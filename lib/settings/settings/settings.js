import page from 'page'
import o from 'component-dom'
import user from 'lib/user/user'
import { dom } from 'lib/render/render'
import config from 'lib/config/config'
import title from 'lib/title/title'
import urlBuilder from 'lib/url-builder'
import Password from '../settings-password/view'
import Profile from '../settings-profile/view'
import Notifications from '../settings-notifications/view'
import Forums from '../settings-forum/view'
import UserBadge from '../settings-user-badges/view'
import settings from './settings-container.jade'

/**
 * Redirect /settings => /settings/profile
 */
page(urlBuilder.for('settings'), urlBuilder.for('settings.profile'))

/**
 * Check if page is valid
 */

const validUrls = [
  urlBuilder.for('settings.profile'),
  urlBuilder.for('settings.password'),
  urlBuilder.for('settings.notifications')
]

const isValid = (ctx, next) => {
  const valid = validUrls.slice()

  if (config.multiForum && user.privileges && user.privileges.canManage) {
    valid.push(urlBuilder.for('settings.forums'))
  }

  if (user.staff) valid.push(urlBuilder.for('settings.user-badges'))

  if (valid.indexOf(ctx.path) === -1) {
    return page.redirect('/404')
  }

  return next()
}

/**
 * Check if exists external settings
 */

const external = (ctx, next) => {
  if (!config.settingsUrl) return next()
  window.location = config.settingsUrl + (ctx.params.page ? ('/' + ctx.params.page) : '')
}

page([
  urlBuilder.for('settings.profile'),
  urlBuilder.for('settings.password'),
  urlBuilder.for('settings.notifications'),
  urlBuilder.for('settings.forums'),
  urlBuilder.for('settings.user-badges')
], user.required, isValid, external, (ctx, next) => {
  const container = o(dom(settings))
  const content = o('.settings-content', container)

  // prepare wrapper and container
  o('#content').empty().append(container)

  // set active section on sidebar
  if (o('.active', container)) {
    o('.active', container).removeClass('active')
  }

  const menuItem = o(`[href="${ctx.path}"]`, container)

  menuItem.addClass('active')

  // Set section's title
  title(menuItem.html())

  // render all settings sections

  const profile = new Profile()
  profile.appendTo(content)

  const password = new Password()
  password.appendTo(content)

  const notifications = new Notifications()
  notifications.appendTo(content)

  if (config.multiForum && user.privileges && user.privileges.canManage) {
    const forums = new Forums()
    forums.appendTo(content)
  }

  if (user.staff) {
    const userBadge = new UserBadge()
    userBadge.appendTo(content)
  }

  // Display current settings section
  o(`[data-section="${ctx.path}"]`, container).removeClass('hide')
})
