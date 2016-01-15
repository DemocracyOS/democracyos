var path = require('path')
var join = path.join

module.exports = function middleware (req, res, next) {
  if (!req.headers['user-agent']) return next()
  if (/facebookexternalhit/.test(req.headers['user-agent'])) {
    req.url = join('/facebook-card', req.url)
  }
  next()
}
