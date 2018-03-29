// Requires winston lib for log
const { log } = require('../main/logger')
const { ADMIN_MAIL } = require('../main/config')
const Settings = require('../cms/db-api/settings')
const User = require('../users/db-api/user')

const setup = async (req, res, next) => {
  log.debug('setup middleware')
  // Find if settings is already init
  try {
    await Settings.getOne()
    // If Settings are init continue
    return next()
    // If not, search if ADMIN_MAIL is set
  } catch (e) {
    if (ADMIN_MAIL !== null) {
      // If ADMIN_MAIL is setted and is saved in DB continue
      const admin = await User.get({ email: ADMIN_MAIL })
      if (admin !== null) {
        return next()
      } else {
        // If ADMIN_MAIL is not saved in DB redirect to 'limbo' page :P
        // return res.redirect('/limbo')
        return next()
      }
    } else {
      // If ADMIN_MAIL is not setted find other admin users in db
      const admins = await User.list({ filter: JSON.stringify({ role: 'admin' }) })
      console.log(admins.docs)
      return next()
    }
  }
}

module.exports = {
  setup
}
