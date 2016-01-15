var path = require('path')
var join = path.join

module.exports = function middleware (req, res, next) {
  if (!req.headers['user-agent']) return next()
  if (/^Twitterbot/.test(req.headers['user-agent'])) {
    req.url = join('/twitter-card', req.url)
  }
  next()
}
