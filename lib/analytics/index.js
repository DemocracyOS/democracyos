/**
 * Module Dependencies
 */

import bus from 'bus'
import page from 'page'
import user from '../user/user.js'
import Analytics from './analytics'

window.analytics = window.analytics || new Analytics()

/**
 * Track every page change
 */

page('*', (ctx, next) => {
  window.analytics.page(ctx.path)
  next()
})

/**
 * Track global user events
 */

bus.on('logout', () => {
  window.analytics.track('logout')
  window.analytics.reset()
})

user.on('loaded', () => {
  const { email, firstName, lastName } = user
  window.analytics.identify(user.id, {
    email,
    firstName,
    lastName
  })
})

export default window.analytics
