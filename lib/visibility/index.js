/**
 * Module dependencies.
 */

var config = require('lib/config')

var hidden = config.visibility === 'hidden'

module.exports = function middleware (req, res, next) {
  if (req.user) return next()
  if (!hidden) return next()

  res.redirect('/signin')
}
