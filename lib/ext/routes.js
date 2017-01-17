'use strict'

let routes

try {
  routes = require('ext/lib/' + 'boot/routes') // hack to fix a circular dependency issue when used with browserify
} catch (err) {
  routes = require('./template/lib/boot/routes')
}

module.exports = routes()
