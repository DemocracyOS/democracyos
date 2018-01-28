const mongoose = require('mongoose')
const { log } = require('../main/logger')
const { MONGO_URL } = require('./config')

mongoose.Promise = global.Promise

mongoose
  .connect(MONGO_URL, {
    useMongoClient: true
  })
  .then(() => {
    log.debug('connection established')
  })
  .catch((err) => {
    log.error(err)
    process.exit(1)
  })

// initialize models
require('../users/models/user')

// handle errors
const db = mongoose.connection

db.on('error', function (err) {
  log.error('Mongoose default connection error: ' + err)
})

db.on('disconnected', function () {
  log.debug('Mongoose default connection disconnected')
})

function shutdown () {
  db.close(function () {
    log.debug('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown())
process.on('SIGINT', () => shutdown())
process.once('SIGUSR2', () => shutdown())

// Enable the mongoose debugger
mongoose.set('debug', (coll, method, query, doc, options) => {
  let set = {
    coll: coll,
    method: method,
    query: query,
    doc: doc,
    options: options
  }

  log.info({
    dbQuery: set
  })
})

module.exports = mongoose
