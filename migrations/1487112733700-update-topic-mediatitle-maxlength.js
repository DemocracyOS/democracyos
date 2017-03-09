'use strict'

const Topic = require('lib/models').Topic
const modelsReady = require('lib/models').ready

exports.up = function up (done) {
  modelsReady()
  
  done()
}

exports.down = function down (done) {
  done()
}
