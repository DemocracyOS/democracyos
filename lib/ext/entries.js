'use strict'

let entries

try {
  entries = require('ext/lib/build/entries.json')
} catch (err) {
  entries = require('./template/lib/build/entries.json')
}

module.exports = entries
