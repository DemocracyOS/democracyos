var expose = require('lib/utils').expose

var scopes = module.exports = {}

scopes.ordinary = {}

scopes.ordinary.keys = {
  expose: [
    'id',
    'firstName',
    'lastName',
    'fullName',
    'displayName',
    'avatar'
  ],

  select: [
    'email',
    'profilePictureUrl'
  ]
}

scopes.ordinary.select = scopes.ordinary.keys.expose.concat(
  scopes.ordinary.keys.select
).join(' ')

scopes.ordinary.expose = expose(scopes.ordinary.keys.expose)
