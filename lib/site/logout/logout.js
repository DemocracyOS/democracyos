/**
 * Module dependencies.
 */

import bus from 'bus'
import page from 'page'
import config from '../../config/config'

page('/logout', (ctx, next) => {
  bus.emit('logout')
  setTimeout(redirect, 100)

  function redirect () {
    if (config.signinUrl) {
      window.location = config.signinUrl
      return window.location
    }
    page('/signin')
  }
})
