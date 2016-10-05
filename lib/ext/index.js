'use strict'

let app

try {
  app = require('ext')
} catch (err) {
  app = require('./template')
}

module.exports = app
