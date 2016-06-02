/**
 * Module dependencies.
 */

import bus from 'bus'
import config from '../config/config.js'
import page from 'page'

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
