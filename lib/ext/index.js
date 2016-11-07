'use strict'

let app

try {
  app = require('ext')
} catch (err) {
  if (err && err.code === 'MODULE_NOT_FOUND') {
    app = require('./template')
  } else {
    throw err
  }
}

module.exports = app
