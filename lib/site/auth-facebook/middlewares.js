var config = require('lib/config')

module.exports.restrict = function authFacebookRestrict (req, res, next) {
  if (config.facebookSignin) {
    if (req.xhr) {
      res.send(403, { error: 'You can only singin with facebook.' })
    } else {
      res.redirect('/')
    }
    return
  }

  return next()
}
