'use strict'

let routes

try {
  routes = require('ext/lib/boot/routes')
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND' &&
      err.message === 'Cannot find module \'ext/lib/boot/routes\'') {
    routes = require('./template/lib/boot/routes')
  } else {
    throw err
  }
}

module.exports = routes()
