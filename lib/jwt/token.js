var log = require('debug')('democracyos:jwt:token')
var moment = require('moment')
var jwt = require('jwt-simple')
var config = require('lib/config')
var utils = require('lib/utils')
var expose = utils.expose

function exposeConfidential (user) {
  return expose('id firstName lastName email avatar staff notifications')(user)
}

exports.encode = function encode (user) {
  user = exposeConfidential(user)

  var expires = moment().add(15, 'days').valueOf()

  var token = jwt.encode({
    iss: user.email,
    exp: expires
  }, config.jwtSecret)

  return {
    token: token,
    expires: expires,
    user: user
  }
}

exports.decode = function decode (encoded, cb) {
  try {
    log('Attempting to decode token...')
    var decoded = jwt.decode(encoded, config.jwtSecret)

    if (decoded.exp <= Date.now()) {
      log('Access token has expired')
      return cb(new Error('Access token has expired'))
    }

    var User = require('lib/models').User
    User.findByEmail(decoded.iss, function (err, user) {
      if (err) log('Token has been decoded, but user fetching failed with the following error: %s', err)
      if (!user) {
        log('Token has been decoded, but user was not found')
        return cb(new Error('No user for token %s', encoded))
      }

      log('Token decoded successfully')
      return cb(err, user, decoded)
    })
  } catch (err) {
    log('Cannot decode token: %s', err)
    return cb(err)
  }
}
