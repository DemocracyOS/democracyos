import mongoose from 'mongoose'
import config from 'config'

export { default as Topic } from './topic'
export { default as User } from './user'

const STATES = mongoose.Connection.STATES
const conn = mongoose.connection

mongoose.connect(config.mongoUrl)

process.on('SIGINT', function () {
  conn.close(() => process.exit(1))
})

export function ready () {
  if (STATES.connecting === conn.readyState) {
    return new Promise(function (_accept, _reject) {
      conn.once('connected', accept)
      conn.once('error', reject)
      conn.once('disconnected', reject)

      function off () {
        conn.removeListener('connected', accept)
        conn.removeListener('error', reject)
        conn.removeListener('disconnected', reject)
      }

      function accept () {
        off()
        _accept()
      }

      function reject () {
        off()
        _reject()
      }
    })
  }

  if (STATES.connected === conn.readyState) {
    return Promise.resolve()
  }

  return Promise.reject()
}
