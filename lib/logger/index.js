import debug from 'debug'

const log = debug('democracyos:logger')

export default function middleware (req, res, next) {
  log(`Request ${req.method} ${req.originalUrl}`)
  next()
}