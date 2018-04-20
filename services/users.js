const { log } = require('../main/logger')
const {
  ErrUserNotLoggedIn,
  ErrNotAdmin
} = require('../main/errors')

const isLoggedIn = (req, res, next) => {
  log.debug('isLoggedIn middleware')
  if (req.user) return next()
  return next(ErrUserNotLoggedIn)
}

const isAdmin = (req, res, next) => {
  log.debug('isAdmin middleware')
  if (req.user && req.user.role === 'admin') return next()
  return next(ErrNotAdmin)
}

const isOwner = (req, res, next) => {
  log.debug('isOwner middleware')
  req.params.id === req.user.id.toString() ? req.isOwner = true : req.isOwner = false
  return next()
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isOwner
}
