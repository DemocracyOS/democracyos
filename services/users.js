const { log } = require('../main/logger')
const {
  ErrUserNotLoggedIn,
  ErrNotAdmin,
  ErrNotAdminNorOwner
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
  if (req.user) {
    if (req.params.id.toString() === req.user.id.toString()) {
      req.user.isOwner = true
    } else {
      req.user.isOwner = false
    }
  }
  return next()
}

const isAdminOrOwner = (req, res, next) => {
  log.debug('isAdminOrOwner middleware')
  if (req.user && req.user.role === 'admin') return next()
  if (req.params.id === req.user.id.toString()) {
    req.user.isOwner = true
    return next()
  }
  return next(ErrNotAdminNorOwner)
}

// const isAnon = (req, res, next) => {
//   log.debug('isAnon middleware')
//   if (req.user === undefined) req.user = { role: null }
//   return next()
// }

const allowedFieldsFor = (user) => {
  let selectedFields = {}
  if (user && user.role === 'admin') return {}
  if (user && user.isOwner) selectedFields.email = 1
  selectedFields._id = 1
  selectedFields.name = 1
  selectedFields.bio = 1
  selectedFields.username = 1
  selectedFields.createdAt = 1
  return selectedFields
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isOwner,
  isAdminOrOwner,
  allowedFieldsFor
}
