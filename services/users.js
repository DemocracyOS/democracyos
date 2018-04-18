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

module.exports = {
  isLoggedIn,
  isAdmin
}
