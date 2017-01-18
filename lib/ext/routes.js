'use strict'

let routes

try {
  routes = require('ext/lib/boot/routes')
} catch (err) {
  routes = require('./template/lib/boot/routes')
}

module.exports = routes()
