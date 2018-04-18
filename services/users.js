const { log } = require('../main/logger')
const { ErrUserNotLoggedIn } = require('../main/errors')

const isLoggedIn = (req, res, next) => {
  log.debug('isLoggedIn middleware')
  if (req.user) {
    return next()
  }
  return next(ErrUserNotLoggedIn)
}

module.exports = {
  isLoggedIn
}
