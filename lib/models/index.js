/**
 * Module Dependencies
 */

import mongoose from 'mongoose'
import config from 'config'
export { default as Topic } from './topic'

mongoose.connect(config.mongoUrl)

mongoose.connection.on('error', function (err) {
  console.error('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', function () {
  console.warn('Mongoose disconnected.')
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination')
    process.exit(1)
  })
})

const connect = new Promise(function (accept, reject) {
  mongoose.connection.on('connected', accept)
  mongoose.connection.on('error', reject)
  mongoose.connection.on('disconnected', reject)
})

export { connect }
