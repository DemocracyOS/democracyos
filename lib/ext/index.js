'use strict'

let app

try {
  app = require('ext')
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND' &&
      err.message === 'Cannot find module \'ext\'') {
    app = require('./template')
  } else {
    throw err
  }
}

module.exports = app
