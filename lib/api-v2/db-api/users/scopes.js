const expose = require('lib/utils').expose

exports.ordinary = {}

exports.ordinary.keys = {
  expose: [
    'id',
    'firstName',
    'lastName',
    'fullName',
    'displayName',
    'avatar',
    'badge'
  ],

  select: [
    'email',
    'profilePictureUrl'
  ]
}

exports.ordinary.select = exports.ordinary.keys.expose.concat(
  exports.ordinary.keys.select
).join(' ')

exports.ordinary.expose = expose(exports.ordinary.keys.expose)
