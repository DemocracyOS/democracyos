var log = require('debug')('democracyos:jwt')
var moment = require('moment')
var config = require('lib/config')
var token = require('./token')

exports.token = token

exports.setCookie = function (encoded, res) {
  return res.cookie('token', encoded.token, { expires: new Date(encoded.expires), httpOnly: true })
}

exports.unsetCookie = function (res) {
  return res.clearCookie('token')
}

exports.setUserOnCookie = function (user, res) {
  return exports.setCookie(token.encode(user), res)
}

exports.signin = function signin (user, req, res) {
  req.user = user
  exports.setUserOnCookie(user, res)
  return res.status(200).send(user)
}

exports.middlewares = {
  user: function user () {
    return function (req, res, next) {
      var qs = req.query ? req.query.access_token : ''
      var encoded = req.cookies.token || qs || req.headers['x-access-token']

      if (encoded) {
        token.decode(encoded, function (err, user, decoded) {
          // Remove token and refresh in case on bad cookie.
          if (err || !user) {
            exports.unsetCookie(res)

            // Also clear on *.domain, because it has errors.
            clearOldCookies(req, res)

            if (err) log('Error decoding token: %s', err)
            if (!user) log('No user found for jwt %s', encoded)

            return next()
          }

          if (decoded.exp <= moment().add(1, 'days').valueOf()) {
            log('Refreshing token of user "%s"', user.id)
            exports.setUserOnCookie(user, res)
          }

          if (config.facebookSignin) {
            if (user.get('profiles.facebook.deauthorized')) {
              exports.unsetCookie(res)
              log('Restricting deauthorized facebook user with id "%s"', user.id)
              return next()
            }
          }

          log('Logging in user %s', user.id)
          req.login(user, function (err) {
            if (err) return res.status(500).json({ error: err.message })
            next()
          })
        })
      } else {
        log('HTTP header x-access-token has no token. Moving on...')
        return next()
      }
    }
  }
}

function clearOldCookies (req, res) {
  var parts = req.get('host').split('.').reverse()
  var domain = []

  parts.forEach(function (part) {
    domain.unshift(part)
    var d = '.' + domain.join('.')
    log('Clearing erroed cookie "token" on "%s"', d)
    res.clearCookie('token', { domain: d })
  })

  return res
}
