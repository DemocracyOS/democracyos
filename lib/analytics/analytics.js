import bus from 'bus'
import user from '../user/user.js'

class Analytics {
  track () {}
  push () {}
  page () {}
  reset () {}
  identify () {}
}

window.analytics = window.analytics || new Analytics()

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
