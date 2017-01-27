import request from 'superagent'
import bus from 'bus'
import debug from 'debug'

const log = debug('democracyos:request')
const proto = request.Request.prototype
const end = proto.end

export default request

/**
 * Wrapper of `request.end`
 */

proto.end = function (fn) {
  let req = this
  fn = fn || function () {}

  // emit request about to exec
  bus.emit('request', req)

  // Accept only json on requests
  req.set('Accept', 'application/json')

  // if `GET`, set random query parameter
  // to avoid browser caching

  if (req.method === 'GET') req.query({ random: Math.random() })

  // emit `request:abort` if req aborts
  req.once('abort', function () {
    bus.emit('request:abort', req)
  })

  return end.call(req, function (err, res) {
    log('end with %s %o', err, res)
    bus.emit('request:end', res, req, err)

    return fn(err, res)
  })
}

/**
 * Wrapper to be able to use ES6 Promises
 */

proto.promise = function () {
  if (this._promise) return this._promise

  this._promise = new Promise((resolve, reject) => {
    this.end((err, res) => {
      if (err) {
        reject(err, res)
      } else {
        resolve(res)
      }
    })
  })

  return this._promise
}
