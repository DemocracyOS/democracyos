import title from '../../title/title'
import page from 'page'
import o from 'component-dom'
import user from '../../user/user'
import { dom } from '../../render/render'
import Password from '../settings-password/view'
import Profile from '../settings-profile/view'
import Notifications from '../settings-notifications/view'
import Forums from '../settings-forum/view'
import UserBadge from '../settings-user-badges/view'
import settings from './settings-container.jade'
import config from '../../config/config'

/**
 * Check if page is valid
 */

let valid = (ctx, next) => {
  var section = ctx.params.section || 'profile'
  var valid = ['profile', 'password', 'notifications']
  if (config.multiForum && user.privileges && user.privileges.canManage) {
    valid.push('forums')
  }
  if (user.staff) valid.push('user-badges')

  ctx.valid = ~valid.indexOf(section)
  return next()
}

/**
 * Check if exists external settings
 */

let external = (ctx, next) => {
  if (!config.settingsUrl) return next()
  window.location = config.settingsUrl + (ctx.params.page ? ('/' + ctx.params.page) : '')
}

page('/settings/:section?', user.required, valid, external, (ctx, next) => {
  if (!ctx.valid) {
    return page.redirect('/404')
  }

  let section = ctx.params.section || 'profile'
  let container = o(dom(settings))
  let content = o('.settings-content', container)

  // prepare wrapper and container
  o('#content').empty().append(container)

  // set active section on sidebar
  if (o('.active', container)) {
    o('.active', container).removeClass('active')
  }

  o('[href="/settings/' + section + '"]', container).addClass('active')

  // Set section's title
  title(o('[href="/settings/' + section + '"]').html())

  // render all settings sections

  let profile = new Profile()
  profile.appendTo(content)

  if (!config.facebookSignin) {
    let password = new Password()
    password.appendTo(content)
  }

  let notifications = new Notifications()
  notifications.appendTo(content)

  if (config.multiForum && user.privileges && user.privileges.canManage) {
    let forums = new Forums()
    forums.appendTo(content)
  }

  if (user.staff) {
    let userBadge = new UserBadge()
    userBadge.appendTo(content)
  }

  // Display current settings section
  o(`#${section}-wrapper`, container).removeClass('hide')
})
